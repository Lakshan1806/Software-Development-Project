import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import RouteSelect from "./RouteSelect";

function Dashboard() {
  return (
    <div className="grid gap-4 grid-cols-[200px_1fr]">
      <Navbar />
      <RouteSelect />
    </div>
  );
}

export default Dashboard;
