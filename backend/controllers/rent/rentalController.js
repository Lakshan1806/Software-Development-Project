import CarModel from "../../models/carModel.model.js";

const rentalController = {
  

  fetchSlideshowImage: async (req, res) => {
    console.log(req.body);
    try {
      const images = await CarModel.find().select({ keyImage: 1 });
      console.log(images);
      images.map((image)=> {
        image.keyImage = image.keyImage
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }) 
      res.json(images);
    } catch (err) {
      console.error("Error in /user/slideshow_images:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default rentalController;
