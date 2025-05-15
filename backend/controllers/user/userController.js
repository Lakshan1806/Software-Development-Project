import userAuthController from "./userAuthController.js"
import userPasswordController from "./userPasswordController.js";
import userProfileController from "./userProfileController.js";

const userController = {
    auth: userAuthController,
    profile: userProfileController,
    password: userPasswordController,
  };
  
  export default userController;