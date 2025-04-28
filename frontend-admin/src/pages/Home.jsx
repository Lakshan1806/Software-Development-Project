import ActivePromotions from "../components/Home/ActivePromotions";
import CarTypes from "../components/Home/CarTypes";
import RecentActivities from "../components/Home/RecentActivities";
import YearlyIncome from "../components/Home/YearlyIncome";

function Home() {
  return (
    <div className="h-full flex flex-col">
      <div>
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px] flex-none">
          Home
        </h1>
      </div>
      <div className="grid gap-3 grid-cols-12 grid-rows-12 min-h-0 flex-1">
        <YearlyIncome />
        <ActivePromotions />
        <CarTypes />
        <RecentActivities />
      </div>
    </div>
  );
}

export default Home;
