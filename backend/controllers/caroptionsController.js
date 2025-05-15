import CarModel from "../models/carModel.model.js";


const getAvailableCars = async (req, res) => {
    
        console.log("Fetching available cars...");
        try {
          const cars = await CarModel.find();
          console.log(cars);
          
          
          cars.forEach((car) => {
            if (car.keyImage) {
              car.keyImage = car.keyImage
                .replace(/\\/g, "/")
                .replace("backend/uploads", "/uploads");
            }
            if (car.Images && Array.isArray(car.Images)) {
              car.Images = car.Images.map((img) =>
                img.replace(/\\/g, "/").replace("backend/uploads", "/uploads")
              );
            }
          });
      
          res.json(cars);
        } catch (err) {
          console.error("Error in /user/available_cars:", err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
      

export default getAvailableCars;