import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const ChatAndCall = () => {
  const [userId, setUserId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [driverInput, setDriverInput] = useState("");

  useEffect(() => {
    if (roomId) {
      socket.emit("join-room", { roomId });

      axios.get(`http://localhost:5000/api/messages/${roomId}`).then((res) => {
        setMessages(res.data);
      });

      socket.on("receive-message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => socket.disconnect();
    }
  }, [roomId]);

  const handleRoomIdGeneration = () => {
    if (userId && driverId) {
      const generatedRoomId = [userId, driverId].sort().join("_");
      setRoomId(generatedRoomId);
    }
  };

  const sendMessage = async (sender, receiver, message, clearInput) => {
    if (!message.trim()) return;

    const newMsg = {
      senderId: sender,
      receiverId: receiver,
      message,
      roomId,
    };

    socket.emit("send-message", newMsg);
    await axios.post("http://localhost:5000/api/messages", newMsg);
    clearInput("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
      {/* User and Driver ID Inputs */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="mb-2 p-3 border-2 border-gray-300 rounded-lg mr-2"
        />
        <input
          type="text"
          placeholder="Enter Driver ID"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          className="mb-2 p-3 border-2 border-gray-300 rounded-lg mr-2"
        />
        <button
          onClick={handleRoomIdGeneration}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg"
        >
          Start Chat
        </button>
      </div>

      {/* Room ID display */}
      {roomId && <h2 className="text-xl mb-4 text-gray-800">Room ID: {roomId}</h2>}

      {/* Chat Box */}
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          height: 250,
          overflowY: "auto",
          border: "2px solid #00A896",
          borderRadius: 10,
          padding: 10,
          backgroundColor: "#ffffff",
          color: "#05668D",
          marginBottom: 20,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 5 }}>
            <b style={{ color: msg.senderId === userId ? "#05668D" : "#00A896" }}>
              {msg.senderId === userId ? "User" : "Driver"}:
            </b>{" "}
            {msg.message}
          </div>
        ))}
      </div>

      {/* Message Input Sections */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* User Input */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <h3 className="mb-2 font-semibold text-gray-700">User</h3>
          <input
            type="text"
            placeholder="User: Type a message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              sendMessage(userId, driverId, userInput, setUserInput)
            }
            className="w-full p-2 border-2 border-yellow-400 rounded mb-2"
          />
          <button
            onClick={() => sendMessage(userId, driverId, userInput, setUserInput)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded"
          >
            Send as User
          </button>
        </div>

        {/* Driver Input */}
        <div className="flex flex-col items-center w-full md:w-1/2">
          <h3 className="mb-2 font-semibold text-gray-700">Driver</h3>
          <input
            type="text"
            placeholder="Driver: Type a message..."
            value={driverInput}
            onChange={(e) => setDriverInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              sendMessage(driverId, userId, driverInput, setDriverInput)
            }
            className="w-full p-2 border-2 border-orange-400 rounded mb-2"
          />
          <button
            onClick={() => sendMessage(driverId, userId, driverInput, setDriverInput)}
            className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-4 py-2 rounded"
          >
            Send as Driver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAndCall;
