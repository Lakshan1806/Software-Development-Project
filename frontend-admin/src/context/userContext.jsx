import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    async function validateSession() {
      try {
        const response = await axios.get("/admin/profile");
        const data = response.data;
        localStorage.setItem("userData", JSON.stringify(data));
        setUser(data);
      } catch (error) {
        console.error("Session validation fail:", error);
        localStorage.removeItem("userData");
        setUser(null);
      }
    }
    validateSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
