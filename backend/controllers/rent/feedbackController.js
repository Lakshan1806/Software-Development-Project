import Feedback from "../../models/feedback.model.js"


const feedbackController = {
    submit: async (req, res) => {
        try {
            const { name, email, rating, message } = req.body; // Get data from frontend

            // Ensure all required fields exist
            if (!name || !email || !rating || !message) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Save to MongoDB
            const feedback = new Feedback({ name, email, rating, message });

            console.log("Feedback to be saved:", feedback);

            await feedback.save();

            res.status(201).json({ success: true, message: "Feedback submitted successfully" });
        } catch (error) {
            console.error("Error saving feedback:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default feedbackController;