import adminAuthController from "./adminAuthController.js";
import adminAccountManagementController from "./adminAccountManagementController.js";
import carManagementController from "./carManagementController.js";

const adminController = {
  auth: adminAuthController,
  account: adminAccountManagementController,
  car: carManagementController,
};

export default adminController; 