import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

const Profile = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await API.get("/auth/profile");
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
        console.error("Profile error:", err);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-transparent">
        Your Profile
      </h1>

      <div className="space-y-4">
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold">Username:</span>
          <span>{profile?.username || user?.username}</span>
        </div>

        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold">Email:</span>
          <span>{profile?.email || user?.email}</span>
        </div>

        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="font-semibold">Phone:</span>
          <span>{profile?.phone || user?.phone}</span>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full mt-6 py-2 px-4 bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] text-black font-bold rounded-lg hover:opacity-90 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
