import { Link } from "react-router-dom";
import Logo from "../assets/Urban_Move_Colour.svg";
import HomeIcon from "../assets/Home.svg";
import RideIcon from "../assets/Ride.svg";
import RentalIcon from "../assets/Rental.svg";
import CustomerIcon from "../assets/Customer.svg";
import DriverIcon from "../assets/Driver.svg";
import FinancialIcon from "../assets/Financial.svg";
import MessageIcon from "../assets/Message.svg";
import AccountIcon from "../assets/Account.svg";
import SettingIcon from "../assets/Setting.svg";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useContext } from "react";

function Navbar() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  console.log("Navbar is rendering");

  function handleSignout() {
    localStorage.removeItem("userData");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    navigate("/", { replace: true });
  }

  const navItems = [
    { path: "/dashboard", label: "Home", icon: HomeIcon },
    { path: "/dashboard/rides", label: "Rides", icon: RideIcon },
    { path: "/dashboard/rentals", label: "Rentals", icon: RentalIcon },
    { path: "/dashboard/customers", label: "Customers", icon: CustomerIcon },
    { path: "/dashboard/drivers", label: "Drivers", icon: DriverIcon },
    { path: "/dashboard/financials", label: "Financials", icon: FinancialIcon },
    { path: "/dashboard/messages", label: "Messages", icon: MessageIcon },
    { path: "/dashboard/account", label: "Account", icon: AccountIcon },
    { path: "/dashboard/settings", label: "Administration", icon: SettingIcon },
  ];
  const linkstyles =
    "font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text flex gap-[10px]";

  return (
    <nav className="bg-black h-dvh flex flex-col items-center py-5 justify-between top-0 bottom-0 sticky">
      <header>
        <img src={Logo} alt="Logo" className="w-[148px] h-[139px]" />
      </header>

      <div className="flex flex-col min-h-[500px] justify-between ">
        {navItems.map((item) => {
          return (
            <Link to={item.path} key={item.path} className={linkstyles}>
              <img src={item.icon} alt={item.label} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div
        className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text pt-[20px] cursor-pointer"
        onClick={handleSignout}
      >
        Sign out
      </div>
    </nav>
  );
}

export default Navbar;
