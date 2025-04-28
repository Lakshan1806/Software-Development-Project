import { useState } from "react";
import AvailableCars from "../components/Rentals/AvailableCars";
import CarDetails from "../components/Rentals/CarDetails";
import AddCars from "../components/Rentals/AddCars";
import CurrentActivity from "../components/Rentals/CurrentActivity";

function Rentals() {
  const [carDetails, setCarDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);

  let component = null;
  if (!editMode) {
    component = (
      <AvailableCars onCarSelect={setCarDetails} onAddCars={setEditMode} />
    );
  } else {
    component = <AddCars onSaveForm={setEditMode} />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between flex-none">
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Rentals
        </h1>
      </div>
      <div className="grid grid-cols-12 grid-rows-12 gap-3 flex-1 min-h-0">
        {component}

        <div className="col-span-8 row-span-12 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto">
          <CarDetails car={carDetails} onUpdate={setCarDetails} />
        </div>
      </div>
    </div>
  );
}

export default Rentals;
