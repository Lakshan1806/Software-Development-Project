import CarDetailsForm from "./CarDetailsForm";

function AddCars() {
  return (
    <div>
      <div className="flex flex-row">
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Add Car
        </h1>
      </div>
      <div className="grid grid-cols-12 grid-rows-12 gap-3 h-svh">
        <CarDetailsForm />
      </div>
    </div>
  );
}

export default AddCars;
