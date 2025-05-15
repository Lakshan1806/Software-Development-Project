import { useForm } from "react-hook-form";
import axios from "axios";

function FeedbackForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Submitting feedback:", data);

      const response = await axios.post("user/submit", data);
      console.log("Response:", response.data);

      if (response.data.success) {
        alert("Thank you for your feedback! 😊");
        reset(); // Clear form
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please check the server.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center mb-4 
               bg-gradient-to-r from-yellow-300 to-orange-500 
               text-transparent bg-clip-text">Customer Feedback</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border rounded-md"
            placeholder="Your Name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
            })}
            className="w-full p-2 border rounded-md"
            placeholder="Your Email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Rating */}
        <div>
          <label className="block font-semibold">Rating</label>
          <select {...register("rating", { required: "Rating is required" })} className="w-full p-2 border rounded-md">
            <option value="">Select Rating</option>
            <option value="5">⭐️⭐️⭐️⭐️⭐️ (Excellent)</option>
            <option value="4">⭐️⭐️⭐️⭐️ (Good)</option>
            <option value="3">⭐️⭐️⭐️ (Average)</option>
            <option value="2">⭐️⭐️ (Poor)</option>
            <option value="1">⭐️ (Very Bad)</option>
          </select>
          {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
        </div>

        {/* Message */}
        <div>
          <label className="block font-semibold">Your Feedback</label>
          <textarea
            {...register("message", { required: "Feedback is required" })}
            className="w-full p-2 border rounded-md h-24"
            placeholder="Write your feedback here..."
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full relative py-2 px-4 rounded-md text-lg font-bold 
             bg-black text-transparent bg-clip-text 
             bg-gradient-to-r from-yellow-200 to-orange-600 
             border-2 border-transparent hover:border-yellow-400 
             transition duration-300 ease-in-out 
             before:absolute before:inset-0 before:-z-10 
             before:bg-gradient-to-r before:from-yellow-400 before:to-orange-500 
             before:blur-lg before:opacity-50 hover:before:opacity-100"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default FeedbackForm;