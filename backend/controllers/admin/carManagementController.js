import CarModel from "../../models/carModel.model.js";
import CarInstance from "../../models/carInstance.model.js";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

const carManagementController = {
  addCarModel: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      console.log(req.body);
      const filePaths = [];
      let keyImage = null;
      if (req.files) {
        if (req.files.keyImage) {
          keyImage = req.files.keyImage[0].path;
        }
        if (req.files.photos && req.files.photos.length > 0) {
          req.files.photos.forEach((file) => filePaths.push(file.path));
          console.log("Uploaded file:", req.files);
        }
      }

      const newCarModel = new CarModel({
        ...req.body,
        images: filePaths,
        keyImage,
      });
      await newCarModel.save();

      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  addCarUnit: async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      console.log(req.body);

      const newCarUnit = new CarInstance(req.body);
      await newCarUnit.save();

      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  getAllCarModels: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const cars = await CarModel.find().select({
      createdAt: 0,
      updatedAt: 0,
    });
    cars.map((car) => {
      if (car.images) {
        car.images = car.images.map((image) =>
          image.replace(/\\/g, "/").replace("backend/uploads", "/uploads")
        );
      }
      if (car.keyImage) {
        car.keyImage = car.keyImage
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }
    });
    res.json(cars);
  },

  getAllCarUnits: async (req, res) => {
    const { token } = req.cookies;
    const { id } = req.query;

    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const units = await CarInstance.find({ carID: id }).select({
      createdAt: 0,
      updatedAt: 0,
    });

    res.json(units);
  },

  updateCarModel: async (req, res) => {
    const { token } = req.cookies;
    console.log(req.body);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const {
        _id,
        make,
        model,
        year,
        engine,
        transmission,
        bodyStyle,
        fuelType,
        mileage,
        price,
        seat,
        speed,
        description,
      } = req.body;
      const updatedCar = await CarModel.findByIdAndUpdate(
        _id,
        {
          $set: {
            make,
            model,
            year,
            engine,
            transmission,
            bodyStyle,
            fuelType,
            mileage,
            price,
            seat,
            speed,
            description,
          },
        },
        { new: true }
      ).select({
        createdAt: 0,
        updatedAt: 0,
      });
      if (updatedCar.images) {
        updatedCar.images = updatedCar.images.map((image) =>
          image.replace(/\\/g, "/").replace("backend/uploads", "/uploads")
        );
      }
      if (updatedCar.keyImage) {
        updatedCar.keyImage = updatedCar.keyImage
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }
      console.log(updatedCar);
      res.status(200).json({ message: "upadate successful", updatedCar });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },
  updateCarUnit: async (req, res) => {
    const { token } = req.cookies;
    console.log(req.body);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { _id, vin, licensePlate, color } = req.body;
      const carUnit = await CarInstance.findByIdAndUpdate(_id, {
        $set: {
          vin,
          licensePlate,
          color,
        },
      });

      res.status(200).json({ message: "upadate successful" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  updateKeyImage: async (req, res) => {
    const { token } = req.cookies;
    console.log(req.body);
    console.log(req.files);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { carId } = req.body;
      let imagePath = null;
      let newImagePath = null;
      const existingCar = await CarModel.findById(carId).lean();
      if (!existingCar) {
        return res.status(404).json({ error: "Car not found" });
      }

      let keyImage = existingCar.keyImage;
      let newPath = null;

      if (req.files) {
        if (req.files.keyImage) {
          keyImage = req.files.keyImage[0].path;
        }
        if (req.files.image) {
          newPath = req.files.image[0].path;
          imagePath = req.body.imagePath;
          imagePath = imagePath
            .replace("/uploads", "backend/uploads")
            .replace(/\//g, "\\");
        }
        if (req.files.newImage) {
          newImagePath = req.files.newImage[0].path;
        }
      }

      if (keyImage !== existingCar.keyImage && existingCar.keyImage) {
        try {
          const absoluteOldPath = path.resolve(existingCar.keyImage);
          await fs.unlink(absoluteOldPath);
          console.log("successfully deleted");
        } catch (unlinkErr) {
          console.warn("Failed to delete old keyImage:", unlinkErr);
        }
      }
      console.log(newPath);
      if (newPath) {
        try {
          const absoluteOldPath = path.resolve(imagePath);
          await fs.unlink(absoluteOldPath);
          console.log("successfully deleted");
        } catch (unlinkErr) {
          console.warn("Failed to delete old Image:", unlinkErr);
        }

        const updated = await CarModel.findOneAndUpdate(
          { _id: carId, images: imagePath },
          { $set: { "images.$": newPath } },
          { new: true }
        );
        if (!updated) {
          return res.status(404).json({ error: "image - Car not found" });
        }
      }

      if (keyImage) {
        const updatedCar = await CarModel.findByIdAndUpdate(
          carId,
          { $set: { keyImage } },
          { new: true }
        );
        if (!updatedCar) {
          return res.status(404).json({ error: "key image - Car not found" });
        }
      }
      if (newImagePath) {
        const updatedCar = await CarModel.findByIdAndUpdate(
          carId,
          { $addToSet: { images: newImagePath } },
          { new: true }
        );
        if (!updatedCar) {
          return res.status(404).json({ error: "new image - Car not found" });
        }
      }

      return res.status(200).json({ success: "success" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },

  deleteCarImage: async (req, res) => {
    const { token } = req.cookies;
    console.log(req.body);
    console.log(req.files);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const { carId } = req.body;
      let { imagePath } = req.body;
      if (imagePath) {
        imagePath = imagePath
          .replace("/uploads", "backend/uploads")
          .replace(/\//g, "\\");
      }

      let updatedCar;
      try {
        updatedCar = await CarModel.findByIdAndUpdate(
          carId,
          { $pull: { images: imagePath } },
          { new: true }
        );
        if (!updatedCar) {
          return res.status(404).json({ error: "Car not found" });
        }
      } catch (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Failed to update car images" });
      }

      try {
        const absolutePath = path.resolve(imagePath);
        await fs.unlink(absolutePath);
        console.log("File deleted:", absolutePath);
      } catch (unlinkErr) {
        console.warn("File deletion error:", unlinkErr);
      }

      return res.status(200).json({ success: "success" });
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: "Token verification failed" });
    }
  },
};

export default carManagementController;
