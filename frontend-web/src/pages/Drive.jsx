//import { useState } from "react";
import Navbardrive from "../drive_components/Navbardrive";
import Drive1stpageleft from "../drive_components/drive1stpageleft";
import img1 from "../drive_photos/img1.svg";
import img3 from "../drive_photos/img3.svg";
import img4 from "../drive_photos/img4.svg";
import Drive2ndpageleft from "../drive_components/drive2ndpageleft";
import Drive2ndpageright from "../drive_components/drive2ndpageright";
import Drive3rdpage from "../drive_components/drive3rdpage";
import Drive4thpage from "../drive_components/drive4thpage";


function Drive() {
  return (
    <div>
      <Navbardrive />

      <div className="flex h-auto px-[25px] py-0  justify-between items-center shrink-[0] self-stretch">
        <div>
          <Drive1stpageleft />
        </div>
        <div>
          <img src={img1} alt="img1" className="w-[1500px] h-[600px]" />
        </div>
      </div>
      <div>
        <div className="p-[10px] text-center text-[36px] font-[700] font-sans">
          Why become a rideshare driver?
        </div>
        <div className="grid grid-cols-2 gap-40 fontsans items-center">
          <div>
            <Drive2ndpageleft />
          </div>
          <div>
            <Drive2ndpageright />
          </div>
        </div>
      </div>
      <div className="flex flex-col  text-black px-[60px] py-0 items-center self-stretch ">
        <div className="px-[10px] py-[20px] items-center gap-[10px]">
          <p className=" text-center text-[36px] font-[700]">
            Here's what you need to become a driver
          </p>
          <img src={img3} alt="img3" />
        </div>

        <Drive3rdpage />
      </div>
      <div className="flex flex-col  text-black px-[60px] py-0 items-center self-stretch ">
        <div className="px-[10px] py-[20px] items-center gap-[9px]">
          <p className=" text-center text-[36px] font-[700] p-2">
            Safety on the road
          </p>
          <img src={img4} alt="img4" />
        </div>

        <Drive4thpage />
      </div>

      
      
    </div>
  );
}

export default Drive;
