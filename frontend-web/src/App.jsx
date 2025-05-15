import axios from "axios";
import NavBar from "./components/Navbar";
import RouteSelect from "./components/RouteSelect.jsx";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials=true;

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true; 
function App() {
  return (
    <div className="debug-outlines">
      <div className="h-dvh ">
        <NavBar />
        <RouteSelect />
      </div>
    </div>
  );
}

export default App;
