import React, { useState, useEffect } from "react";
import Car10 from "../assets/home_car1 0.svg";
import Car20 from "../assets/home_car2 0.svg";
import Car30 from "../assets/home_car3 0.svg";
import Pro10 from "../assets/home_pro1.svg";
import Pro20 from "../assets/home_pro2.svg";

function Home() {
  const [currentImage, setCurrentImage] = useState(Pro10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage === Pro10 ? Pro20 : Pro10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full px-10 mt-10">
      <div className="flex justify-between items-center w-full">
        <div className="relative w-[380px] h-[570px] overflow-hidden border-4 border-black rounded-3xl transition-transform duration-300 ease-in-out hover:scale-110">
          <img src={Car20} alt="Car" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-[2px] rounded-2xl bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] transition-transform duration-300 ease-in-out hover:scale-105">
              <button className="w-36 h-12 bg-black text-[#FFD12E] text-[20px] font-inter font-normal break-words rounded-2xl shadow-2xl flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-100">
                Continue
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-[380px] h-[570px] overflow-hidden border-4 border-black rounded-3xl transition-transform duration-300 ease-in-out hover:scale-110">
          <img src={Car10} alt="Car" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-[2px] rounded-2xl bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] transition-transform duration-300 ease-in-out hover:scale-105">
              <button className="w-36 h-12 bg-black text-[#FFD12E] text-[20px] font-inter font-normal break-words rounded-2xl shadow-2xl flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-100">
                Continue
              </button>
            </div>
          </div>
        </div>

        <div className="relative w-[380px] h-[570px] overflow-hidden border-4 border-black rounded-3xl transition-transform duration-300 ease-in-out hover:scale-110">
          <img src={Car30} alt="Car" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-[2px] rounded-2xl bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] transition-transform duration-300 ease-in-out hover:scale-105">
              <button className="w-36 h-12 bg-black text-[#FFD12E] text-[20px] font-inter font-normal break-words rounded-2xl shadow-2xl flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-100">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-[1000px] h-[390px] mt-10 overflow-hidden">
        <div
          className="absolute w-full h-full transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(${currentImage === Pro10 ? 0 : -100}%)`, 
          }}
        >
          <img
            src={Pro10}
            alt="Slideshow Image 1"
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>

        <div
          className="absolute w-full h-full transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(${currentImage === Pro20 ? 0 : 100}%)`, 
          }}
        >
          <img
            src={Pro20}
            alt="Slideshow Image 2"
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      </div>

      <div className="text-center mt-10">
        <p className="text-black text-[50px] font-inter font-normal break-words">
          At URBANMOVE Sri Lanka, we transform the way you travel for the better
        </p>
      </div>

      <div className="text-center mt-8 px-10">
        <p className="text-black text-[30px] font-inter font-normal break-words">
          Movement is our passion; it fuels our purpose. Every day, we wake up<br />
          driven to enhance your journey. We strive to redefine what it means <br />
          to travel seamlessly - whether you’re exploring the vibrant streets of <br />
          Colombo or heading to the serene beaches of Galle. We’re here to <br />
          connect you to every destination, every opportunity, brand every <br />
          adventure you seek. With us, your ride is not just a trip; it’s a <br />
          commitment to comfort, safety, and efficiency. Experience the <br />
          freedom of real-time travel, powered by our dedicated team, all at <br />
          the incredible speed of now.
        </p>
      </div>
    </div>
  );
}

export default Home;
