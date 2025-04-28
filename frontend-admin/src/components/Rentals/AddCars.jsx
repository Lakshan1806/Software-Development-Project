import { useState, useRef } from "react";
import axios from "axios";

function AddCars({ onSaveForm }) {
  const fileInputRef = useRef(null);
  const keyImageInputRef = useRef(null);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");
  const [transmission, setTransmission] = useState("");
  const [bodyStyle, setBodyStyle] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [seat, setSeat] = useState("");
  const [speed, setSpeed] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [tempImage, setTempImage] = useState(null);
  const [keyImageUrl, setKeyImageUrl] = useState();
  const [keyTempImage, setKeyTempImage] = useState(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleKeyImageClick = () => {
    keyImageInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    } else {
      const previewUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImageUrl(previewUrls);
      setTempImage(files);
    }
  };

  const handleKeyFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    } else {
      const previewUrl = URL.createObjectURL(file);
      setKeyImageUrl(previewUrl);
      setKeyTempImage(file);
    }
  };

  const handleSave = async (e) => {
    const formData = new FormData();
    formData.append("make", make);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("engine", engine);
    formData.append("transmission", transmission);
    formData.append("bodyStyle", bodyStyle);
    formData.append("fuelType", fuelType);
    formData.append("mileage", mileage);
    formData.append("price", price);
    formData.append("seat", seat);
    formData.append("speed", speed);
    formData.append("description", description);
    console.log(tempImage); 
    console.log(tempImage.constructor.name); 

    if (tempImage) {
      Array.from(tempImage).forEach((file) => {
        formData.append("photos", file);
      });
    }
    if (keyTempImage) {
      formData.append("keyImage", keyTempImage);
    }

    try {
      const response = await axios.post("/admin/add_car_model", formData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  return (
    <div className="col-span-4 row-span-12 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col overflow-auto">
      <div className="flex flex-col">
        <div>
          <h2>Add Car Details</h2>
          <img
            src={keyImageUrl}
            alt={"preview"}
            className="w-24 h-24 rounded-lg object-cover"
          />

          <div className="flex flex-row">
            <input
              type="file"
              ref={keyImageInputRef}
              style={{ display: "none" }}
              onChange={handleKeyFileChange}
            />

            <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px]">
              <button
                type="button"
                className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
                onClick={handleKeyImageClick}
              >
                Upload Key photo
              </button>
            </div>

            {imageUrl.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index}`}
                className="w-24 h-24 rounded-lg object-cover"
              />
            ))}

            <input
              type="file"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px]">
              <button
                type="button"
                className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
                onClick={handleImageClick}
              >
                Upload new photo
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="make">Make:</label>
            <input
              type="text"
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="e.g. Audi"
            />
          </div>
          <div>
            <label htmlFor="model">Model:</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="A6"
            />
          </div>
          <div>
            <label htmlFor="year">Year:</label>
            <input
              type="text"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder=""
            />
          </div>
          <div>
            <label htmlFor="engine">Engine:</label>
            <input
              type="text"
              id="engine"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              placeholder=""
            />
          </div>

          <div>
            <label htmlFor="transmission">Transmission:</label>
            <input
              type="text"
              id="transmission"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              placeholder=""
            />
          </div>
          <div>
            <label htmlFor="bodystyle">Body Style:</label>
            <input
              type="text"
              id="bodyStyle"
              value={bodyStyle}
              onChange={(e) => setBodyStyle(e.target.value)}
              placeholder=""
            />
          </div>

          <div>
            <label htmlFor="fueltype">Fuel Type:</label>
            <input
              type="text"
              id="fueltype"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              placeholder=""
            />
          </div>

          <div>
            <label htmlFor="mileage">Range (km on full tank):</label>
            <input
              type="number"
              id="mileage"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="e.g. 400"
            />
          </div>

          <div>
            <label htmlFor="price">Price (per day):</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 50"
            />
          </div>
          <div>
            <label htmlFor="seat">Seats:</label>
            <input
              type="number"
              id="seat"
              value={seat}
              onChange={(e) => setSeat(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label htmlFor="speed">Speed:</label>
            <input
              type="number"
              id="speed"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              placeholder="e.g. 150"
            />
          </div>

          <div>
            <label htmlFor="description">About:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description or highlights"
            />
          </div>

          <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px] cursor-pointer">
            <button
              type="button"
              className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
              onClick={handleSave}
            >
              save
            </button>
          </div>
        </div>
      </div>
      <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px] cursor-pointer">
        <button
          type="button"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
          onClick={() => {
            onSaveForm(false);
          }}
        >
          done
        </button>
      </div>
    </div>
  );
}

export default AddCars;
