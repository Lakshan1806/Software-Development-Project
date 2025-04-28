import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const sendSMS = async (phone, messageContent) => {
    try {
        const apiToken = process.env.TEXT_API_TOKEN;
        const senderId = process.env.TEXT_LK_SENDER_ID;

        if (!apiToken || !senderId) {
            console.warn("TEXT_LK_API_KEY or TEXT_LK_SENDER_ID not set in .env");
            return false;
        }

        const response = await axios.post(
            process.env.TEXT_API_ENDPOINT,
            {
                api_token: apiToken,
                recipient: phone,
                message: messageContent,
                sender_id: senderId
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("SMS Response:", response.data);

        return response.data.status === "success";
    } catch (error) {
        console.error(" Error sending SMS:", error.response ? error.response.data : error.message);
        return false;
    }
};

export default sendSMS;