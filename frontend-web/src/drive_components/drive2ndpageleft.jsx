
import img2L from "../drive_photos/img2L.svg";

function Drive2ndpageleft() {
  return (
    <div className=" flex flex-col leading-10 p-30 w-[650px] pt-6 ">
      <p className="text-[32px] font-[700] mb-5">Take control of your time</p>
      <p className="text-[24px] font-[500] ">
        . Many driving jobs come with long hours and strict schedules. With
        Urban Move, you’re in control
      </p>
      <img src={img2L} alt="img2L" className="w-[500px] h-[450px]" />
    </div>
  );
}

export default Drive2ndpageleft;
