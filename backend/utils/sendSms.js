import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const sendSMS = async (phone, message) => {
    try {
        const response = await axios.post(
            process.env.TEXTME_API_ENDPOINT,
            {
                to: phone,
                text: message,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.TEXTME_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("SMS Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending SMS:", error.response ? error.response.data : error.message);
        return null;
    }
};

export default sendSMS;
