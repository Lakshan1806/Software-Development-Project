import { useNavigate } from "react-router-dom";
import Taxi from "../assets/help_logo.svg";
import Ride from "../assets/help_ride.svg";
import Rent from "../assets/help_rent.svg";
import Drive from "../assets/help_drive.svg";

function Help() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[750px] text-center">
      <img src={Taxi} alt="Taxi Logo" className="w-[197px] h-[197px] mb-5" />
      <h2 className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        Welcome to Urban Drive Support
      </h2>

      <div className="flex flex-wrap justify-center gap-75 mt-8">
        <div className="w-[220px] p-4 border-4 border-yellow-400 rounded-lg flex flex-col items-center">
          <img src={Ride} alt="Ride" className="w-[180px] h-[180px]" />
          <div className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">RIDE</div>
        </div>

        <div className="w-[220px] p-4 border-4 border-yellow-400 rounded-lg flex flex-col items-center">
          <img src={Rent} alt="Rent" className="w-[180px] h-[180px]" />
          <div className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">RENT</div>
        </div>

        <div className="w-[220px] p-4 border-4 border-yellow-400 rounded-lg flex flex-col items-center">
          <img src={Drive} alt="Drive" className="w-[180px] h-[180px]" />
          <div className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">DRIVE</div>
        </div>
      </div>

      {/* Add a button to navigate to the Payment Page */}
      <button 
        onClick={() => navigate("/payment")} 
        className="mt-6 px-6 py-3 bg-yellow-500 text-white text-xl rounded-lg hover:bg-orange-500"
      >
        Go to Payment
      </button>
    </div>
  );
}

export default Help;
