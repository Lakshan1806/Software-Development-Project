import axios from "axios";
import { useEffect, useState } from "react";

function AvailableCars({ onCarSelect, onAddCars }) {
  const [car, setCar] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_car_models");
        console.log("res :", response);
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleButtonClick = () => {
    onAddCars(true);
  };

  return (
    <div className="col-span-4 row-span-12 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col overflow-auto">
      {car.map((cars) => {
        console.log("data :", cars);
        console.log("data :", cars.images);
        return (
          <div
            key={cars._id}
            className="p-4 my-2  rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-4"
          >
            <img
              src={cars.keyImage}
              alt="car image"
              className="w-1/2 h-full rounded-lg object-cover"
            />
            <div className="flex flex-col w-1/2">
              <h3 className="text-sm font-bold">{cars.make}</h3>
              <h3 className="text-xl font-bold">{cars.model}</h3>
              <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[15px]">
                <button
                  type="button"
                  className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
                  onClick={() => onCarSelect(cars)}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px] cursor-pointer sticky bottom-0">
        <button
          type="button"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
          onClick={handleButtonClick}
        >
          Add Cars
        </button>
      </div>
    </div>
  );
}

export default AvailableCars;
