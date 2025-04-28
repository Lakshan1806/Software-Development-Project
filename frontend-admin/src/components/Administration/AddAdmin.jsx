import Logo from "../../assets/Urban_Move.svg";
import Line from "../../assets/Line.svg";
import { useState } from "react";
import axios from "axios";
import { IoAddCircle } from "react-icons/io5";

function AddAdmin() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  console.log(username, email);

  const formData = {
    username: username,
    email: email,
  };

  const addAdmin = async (event) => {
    event.preventDefault();
    await axios.post("/admin/add_admin", formData);
  };

  return (
    <div className="col-span-4 row-span-12 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <div className="flex items-center justify-center h-full">
        <div className="max-w-md flex flex-col items-center gap-[42px]">
          <div className="flex flex-col items-center [-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
            <h1>Add admin account</h1>
          </div>

          <img src={Logo} className="w-[200px] h-[200px]" />
          <img src={Line} />

          <div>
            <form
              onSubmit={addAdmin}
              className="flex flex-col gap-[42px]  items-center "
            >
              <div className="flex flex-col w-[300px]">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  value={username}
                  required
                />
              </div>

              <div className="flex flex-col w-[300px]">
                <label htmlFor="email">E-mail</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                  required
                />
              </div>

              <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px]">
                <button
                  type="submit"
                  className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer flex flex-row items-center gap-[10px]"
                >
                  <IoAddCircle className="fill-[#FF7C1D]" />
                  ADD ADMIN
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAdmin;
