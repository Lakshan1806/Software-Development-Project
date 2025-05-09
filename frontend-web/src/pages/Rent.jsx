import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // <-- use auth context
import myImage from "../assets/rent.image.1.png";
import myImage2 from "../assets/rent.image.2.png";
import myImage3 from "../assets/rent.image.3.png";
import myImage4 from "../assets/rent.image.4.png";
import RentNowForm from "../components/Rent/RentNowForm";

function Rent() {
  const { isAuthenticated } = useAuth(); // use context auth state
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Open form automatically if redirected with ?showForm=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showForm") === "true" && isAuthenticated) {
      setShowForm(true);
      document.body.style.overflow = "hidden";
    }
  }, [location.search, isAuthenticated]);

  const handleShowForm = () => {
    if (!isAuthenticated) {
      // Redirect to signin with redirect path
      navigate(`/signin?redirect=/rent?showForm=true`);
    } else {
      setShowForm(true);
      document.body.style.overflow = "hidden";
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold text-center">RENT</h1>

      <div className="flex flex-col items-center md:flex-row md:justify-between mt-10">
        <Image1 />
        <Text1 />
      </div>

      {!showForm && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleShowForm}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Rent Now
          </button>
        </div>
      )}

      <div className="flex justify-center gap-12 mt-12">
        <Image src={myImage2} />
        <Image src={myImage3} />
        <Image src={myImage4} />
      </div>

      <Slideshow />

      {showForm && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-xl bg-white rounded-xl shadow-lg">
              <button
                onClick={handleCloseForm}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold z-10"
              >
                &times;
              </button>

              <RentNowForm onClose={handleCloseForm} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Image1() {
  return (
    <div className="w-full md:w-1/2 flex justify-center">
      <img
        src={myImage}
        alt="Car Rental"
        className="w-full max-w-sm md:max-w-md lg:max-w-lg"
      />
    </div>
  );
}

function Text1() {
  return (
    <div className="text-center md:text-left md:w-1/2 p-4">
      <h1 className="text-2xl md:text-4xl font-bold">
        Browse our fleet and pick the perfect car for a day, a week, or even a
        month.
      </h1>
    </div>
  );
}

function Image({ src }) {
  return (
    <div className="w-1/3 flex justify-center">
      <img
        src={src}
        alt="Rental Car"
        className="w-full max-w-xs md:max-w-sm lg:max-w-md"
      />
    </div>
  );
}

function Slideshow() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/user/slideshow_images");
        setImages(response.data);
      } catch (error) {
        console.log("Error loading slideshow images", error);
      }
    };

    fetchData();
  }, []);

  const slideshowPath = images.map((image) => image.keyImage);

  useEffect(() => {
    if (slideshowPath.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideshowPath.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slideshowPath]);

  if (slideshowPath.length === 0) return <div>Loading slideshow...</div>;

  return (
    <div className="w-full h-64 flex justify-center items-center bg-gray-200 rounded-xl overflow-hidden shadow-md mt-12 ">
      <img
        src={slideshowPath[current]}
        alt="slideshow"
        className="w-full h-full object-cover transition-all duration-500"
      />
    </div>
  );
}

export default Rent;
