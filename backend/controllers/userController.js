import userModel from "../models/usermodel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.body.userId || req.session.user?._id;

    if (!userId) {
      return res.json({ success: false, message: "User ID not provided" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    res.json({
      succes: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
        email: user.email,
        phone: user.phone,
        profilePic: user.profilePic,
        googleId: user.googleId,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
