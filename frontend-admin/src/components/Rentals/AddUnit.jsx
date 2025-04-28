import axios from "axios";
import { useState } from "react";

function AddUnit({ onSaveForm, carID }) {
  const [vin, setVin] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState("");

  const handleSave = async () => {
    const newCarData = { vin, licensePlate, color, carID };
    console.log("New Car Data:", newCarData);
    const response = await axios.post("/admin/add_unit", newCarData);
  };
  console.log("ref", carID);
  return (
    <div>
      <div>
        <label htmlFor="vin">VIN:</label>
        <input
          type="text"
          id="vin"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          required
          placeholder="Enter VIN"
        />
      </div>

      <div>
        <label htmlFor="licensePlate">License Plate:</label>
        <input
          type="text"
          id="licensePlate"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
          required
          placeholder="Enter License Plate"
        />
      </div>

      <div>
        <label htmlFor="color">Color:</label>
        <input
          type="text"
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Enter car color"
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

export default AddUnit;
