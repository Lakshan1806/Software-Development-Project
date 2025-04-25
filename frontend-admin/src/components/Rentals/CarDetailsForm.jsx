import { useState, useRef } from "react";

function CarDetailsForm() {
  const fileInputRef = useRef(null);
  const [carName, setCarName] = useState("");
  const [about, setAbout] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [capacitySeats, setCapacitySeats] = useState("");
  const [topSpeed, setTopSpeed] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [range, setRange] = useState("");
  const [price, setPrice] = useState("");
  const [unitsAvailable, setUnitsAvailable] = useState("");
  const [imageUrl, setImageUrl] = useState(["default-image.png"]);
  const [tempImage, setTempImage] = useState(null);

  const handleSubmit = () => {
    const carData = {
      carName,
      about,
      transmission,
      fuel,
      capacitySeats,
      topSpeed,
      acceleration,
      range,
      price,
      unitsAvailable,
    };

    console.log("Car data:", carData);
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
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

  return (
    <div className="col-span-12 row-span-12 p-4 rounded-xl border border-black flex flex-col">
      <div>
        <h2>Add / Edit Car Details</h2>
        <div className="flex flex-row">
          {imageUrl.map((url, index) => (
            <img key={index} src={url} alt={`Preview ${index}`} className="w-24 h-24 rounded-lg object-cover"/>
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
          <label htmlFor="carName">Car Name:</label>
          <input
            type="text"
            id="carName"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            placeholder="e.g. Audi A6"
          />
        </div>

        <div>
          <label htmlFor="about">About:</label>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Short description or highlights"
          />
        </div>

        <div>
          <label htmlFor="transmission">Transmission:</label>
          <input
            type="text"
            id="transmission"
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            placeholder="e.g. Automatic"
          />
        </div>

        <div>
          <label htmlFor="fuel">Fuel Type:</label>
          <input
            type="text"
            id="fuel"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            placeholder="e.g. Gasoline"
          />
        </div>

        <div>
          <label htmlFor="capacitySeats">Seats:</label>
          <input
            type="number"
            id="capacitySeats"
            value={capacitySeats}
            onChange={(e) => setCapacitySeats(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>

        <div>
          <label htmlFor="topSpeed">Top Speed (mph):</label>
          <input
            type="number"
            id="topSpeed"
            value={topSpeed}
            onChange={(e) => setTopSpeed(e.target.value)}
            placeholder="e.g. 120"
          />
        </div>

        <div>
          <label htmlFor="acceleration">Acceleration (0-60 mph):</label>
          <input
            type="text"
            id="acceleration"
            value={acceleration}
            onChange={(e) => setAcceleration(e.target.value)}
            placeholder="e.g. 8.0 seconds"
          />
        </div>

        <div>
          <label htmlFor="range">Range (miles on full tank):</label>
          <input
            type="number"
            id="range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
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
          <label htmlFor="unitsAvailable">Units Available:</label>
          <input
            type="number"
            id="unitsAvailable"
            value={unitsAvailable}
            onChange={(e) => setUnitsAvailable(e.target.value)}
            placeholder="e.g. 12"
          />
        </div>

        <button type="submit">Save Car</button>
      </div>
    </div>
  );
}

export default CarDetailsForm;
