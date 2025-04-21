import NavBar from "./components/Navbar";
import Signupinitialpage from "./pages/Signupinitialpage";
import Home from "./pages/Home";
import Rent from "./pages/Rent";
import Drive from "./pages/Drive";
import Ride from "./pages/Ride";
import Help from "./pages/Help";
import Feedback from "./pages/Feedback";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";

import PaymentPage from "./pages/PaymentPage.jsx";
import TripHistory from "./pages/TripHistory.jsx"; // Import TripHistory
import EmailForm from "./pages/EmailForm"; 




import { AuthProvider } from "./context/AuthContext";
import RouteSelect from "./components/RouteSelect.jsx";
//import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <div className="debug-outlines">
      {/*<GoogleOAuthProvider clientId="8873127349-1mrci9u3pdqucjqbjarq4f0n8aoi1fp4.apps.googleusercontent.com">*/}
        <AuthProvider>
          <div className="h-dvh "> 
            <NavBar />
            <RouteSelect />
          </div>
        </AuthProvider>
      {/*</GoogleOAuthProvider>*/}
    </div>
  );
}

export default App;
