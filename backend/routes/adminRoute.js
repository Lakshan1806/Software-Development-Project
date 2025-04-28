import express from "express";
import adminController from "../controllers/admin/adminController.js";
import adminUpload from "../middlewares/adminMulter.js";
import carUpload from "../middlewares/carsMulter.js";
import authenticateToken from "../middlewares/adminTokenAuthenticator.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", adminController.auth.login);
adminRoutes.post("/change_password", adminController.account.changePassword);
adminRoutes.post("/add_admin", adminController.account.addAdmin);
adminRoutes.post(
  "/update_details",
  adminUpload.single("photo"),
  adminController.account.updateDetails
);
adminRoutes.post(
  "/add_car_model",
  carUpload.fields([
    { name: "keyImage", maxCount: 1 },
    { name: "photos", maxCount: 10 },
  ]),
  adminController.car.addCarModel
);
adminRoutes.post(
  "/update_car_model",
  carUpload.none(),
  adminController.car.updateCarModel
);
adminRoutes.post("/add_unit", adminController.car.addCarUnit);
adminRoutes.post("/update_car_unit", adminController.car.updateCarUnit);

adminRoutes.get("/get_all_admin", adminController.account.getAllAdmin);
adminRoutes.get("/profile", authenticateToken, adminController.auth.profile);
adminRoutes.get("/account_info", adminController.account.accountInfo);
adminRoutes.get("/get_all_car_models", adminController.car.getAllCarModels);
adminRoutes.get("/get_all_car_units", adminController.car.getAllCarUnits);

adminRoutes.patch(
  "/update_car_image",
  carUpload.fields([
    { name: "keyImage", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "newImage", maxCount: 1 },
  ]),
  adminController.car.updateKeyImage
);

adminRoutes.delete(
  "/delete_car_image",
  adminController.car.deleteCarImage
);
export default adminRoutes;
