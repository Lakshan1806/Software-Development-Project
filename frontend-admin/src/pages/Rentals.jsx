import AvailableCars from "../components/Rentals/AvailableCars";
import CurrentActivity from "../components/Rentals/CurrentActivity";
import { useNavigate } from "react-router-dom";

function Rentals() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/dashboard/add_Vehicle");
  };
  return (
    <div>
      <div>
        <div className="flex flex-row">
          <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
            Rentals
          </h1>
          <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px] cursor-pointer">
            <button
              type="button"
              className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
              onClick={handleButtonClick}
            >
              Add Cars
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 grid-rows-12 gap-3 h-svh">
          <AvailableCars />
          <CurrentActivity />
        </div>
      </div>
    </div>
  );
}

export default Rentals;
