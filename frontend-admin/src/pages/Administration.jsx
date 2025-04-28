import AddAdmin from "../components/Administration/AddAdmin";
import AdminCard from "../components/Administration/AdminCard";
import AdminList from "../components/Administration/AdminList";

function Administration() {
  return (
    <div className="h-full flex flex-col">
      <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px] flex-none">
        Administration
      </h1>
      <div className="grid grid-cols-12 grid-rows-12 gap-3 flex-1 min-h-0">
        <AdminList />
        <AddAdmin />
      </div>
    </div>
  );
}

export default Administration;
