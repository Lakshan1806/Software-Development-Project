import { useEffect, useState, useRef } from "react";
import axios from "axios";

function AccountInfo() {
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("default-image.png");
  const [tempImage, setTempImage] = useState(null);

  console.log(imageUrl);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/account_info");
        console.log(response);
        setName(response.data.name);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setImageUrl(response.data.photo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    console.log(imageUrl);
    fetchData();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    } else {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setTempImage(file);
    }
  };
  const handleSave = async (e) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);

    if (tempImage) {
      formData.append("photo", tempImage);
    }

    try {
      const response = await axios.post("/admin/update_details", formData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="col-span-12 row-span-12 p-4 rounded-xl border border-black flex flex-col">
      <div className="flex flex-row">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px]">
          <button
            type="button"
            className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
            onClick={handleImageClick}
          >
            Upload new photo
          </button>
        </div>
      </div>
      <div>
        <div className="flex flex-row">
          <p>Personal info</p>
        </div>
        <div>
          <div className="flex flex-col w-[300px]">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
          </div>
          <div className="flex flex-col w-[300px]">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
            />
          </div>
          <div className="flex flex-col w-[300px]">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <div className="flex flex-col w-[300px]">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              value={phone}
            />
          </div>
        </div>
        <div>
          <button>Password</button>
        </div>
        <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px] cursor-pointer">
          <button
            type="button"
            className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
            onClick={handleSave}
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountInfo;
