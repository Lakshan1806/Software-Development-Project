import axios from "axios";
import { useEffect, useState } from "react";

function AdminList() {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_admin");
        console.log(response);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="col-span-8 row-span-12 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col">
      {user.map((admin) => {
        console.log(admin.photo);
        return (
          <div
            key={admin._id}
            className="p-4 my-2 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]"
          >
            <img
              src={admin.photo}
              alt="profile image"
              className="w-24 h-24 rounded-full object-cover"
            />
            <h3 className="text-lg font-bold">{admin.name}</h3>
            <p>Username: {admin.username}</p>
            <p>Email: {admin.email}</p>
          </div>
        );
      })}
    </div>
  );
}

export default AdminList;
