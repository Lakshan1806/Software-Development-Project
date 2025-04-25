import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import Rent from "./pages/Rent";
import Drive from "./pages/Drive";
import Ride from "./pages/Ride";
import Help from "./pages/Help";
import Feedback from "./pages/Feedback";
import PaymentPage from "./pages/PaymentPage.jsx";
import TripHistory from "./pages/TripHistory.jsx"; // Import TripHistory
import EmailForm from "./pages/EmailForm"; // ✅ Correct path


function App() {
  const userId = "123456"; // Replace this with actual logged-in user ID

  return (
    <div>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/drive" element={<Drive />} />
          <Route path="/ride" element={<Ride />} />
          <Route path="/help" element={<Help />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/email" element={<EmailForm />} /> {/*  Add Email Form route */}
        </Routes>

       
      </main>
    </div>
  );
}

export default App;
