import React, { useEffect, useRef, useState } from "react";
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
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const localAudioRef = useRef();
  const remoteAudioRef = useRef();
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const logCall = async (status) => {
    if (!userId || !driverId) return;
    try {
      await axios.post("http://localhost:5000/api/call-log", {
        userId,
        driverId,
        callType: "audio",
        callStatus: status,
      });
    } catch (err) {
      console.error("Failed to log call", err);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    try {
      socket.emit("join-room", { roomId });

      axios.get(`http://localhost:5000/api/messages/${roomId}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error("Failed to fetch messages", err));

      socket.on("receive-message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      socket.on("call-made", async ({ offer, socket: from }) => {
        try {
          await setupMedia();
          peerConnection.current = new RTCPeerConnection(servers);
          addLocalTracks();

          peerConnection.current.ontrack = ({ streams: [stream] }) => {
            remoteAudioRef.current.srcObject = stream;
          };

          peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("ice-candidate", {
                to: from,
                candidate: event.candidate,
              });
            }
          };

          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          socket.emit("make-answer", {
            answer,
            to: from,
          });

          setInCall(true);
          await logCall("started");
        } catch (err) {
          console.error("Error handling incoming call", err);
        }
      });

      socket.on("answer-made", async ({ answer }) => {
        try {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
          setInCall(true);
        } catch (err) {
          console.error("Error setting remote description", err);
        }
      });

      socket.on("ice-candidate", ({ candidate }) => {
        try {
          if (peerConnection.current) {
            peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (err) {
          console.error("Error adding ICE candidate", err);
        }
      });
    } catch (err) {
      console.error("Error in useEffect", err);
    }

    return () => {
      socket.off("receive-message");
      socket.off("call-made");
      socket.off("answer-made");
      socket.off("ice-candidate");
    };
  }, [roomId]);

  const setupMedia = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      localAudioRef.current.srcObject = localStream.current;
    } catch (err) {
      console.error("Failed to access microphone", err);
    }
  };

  const addLocalTracks = () => {
    try {
      localStream.current.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStream.current);
      });
    } catch (err) {
      console.error("Error adding local tracks", err);
    }
  };

  const initiateCall = async () => {
    try {
      await setupMedia();
      peerConnection.current = new RTCPeerConnection(servers);
      addLocalTracks();

      peerConnection.current.ontrack = ({ streams: [stream] }) => {
        remoteAudioRef.current.srcObject = stream;
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            to: driverId,
            candidate: event.candidate,
          });
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit("call-user", {
        offer,
        to: driverId,
      });

      setInCall(true);
      await logCall("started");
    } catch (err) {
      console.error("Failed to initiate call", err);
    }
  };

  const endCall = async () => {
    try {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }

      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }

      setInCall(false);
      await logCall("completed");
    } catch (err) {
      console.error("Failed to end call", err);
    }
  };

  const toggleMute = () => {
    try {
      if (localStream.current) {
        localStream.current.getAudioTracks()[0].enabled = isMuted;
        setIsMuted(!isMuted);
      }
    } catch (err) {
      console.error("Failed to toggle mute", err);
    }
  };

  const handleRoomIdGeneration = () => {
    if (userId && driverId) {
      const generatedRoomId = [userId, driverId].sort().join("_");
      setRoomId(generatedRoomId);
    }
  };

  const sendMessage = async (sender, receiver, message, clearInput) => {
    if (!message.trim()) return;

    const newMsg = { senderId: sender, receiverId: receiver, message, roomId };
    try {
      socket.emit("send-message", newMsg);
      await axios.post("http://localhost:5000/api/messages", newMsg);
      clearInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-100 to-white font-sans text-gray-900">
      <h1 className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-8">
        UrbanMove Live Chat & Call
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-3xl mb-8">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Driver ID"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleRoomIdGeneration}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md"
        >
          Start Chat
        </button>
      </div>

      {roomId && (
        <>
          <div className="text-lg font-semibold mb-4 text-gray-700">
            Room ID: <span className="font-mono">{roomId}</span>
          </div>
          <div className="flex gap-4 mb-8">
            <button
              onClick={initiateCall}
              disabled={inCall}
              className="bg-green-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 transition-all"
            >
              📞 Start Call
            </button>
            <button
              onClick={toggleMute}
              disabled={!inCall}
              className="bg-yellow-400 text-white px-5 py-2 rounded-xl font-semibold hover:bg-yellow-500 disabled:opacity-50 transition-all"
            >
              {isMuted ? "🔊 Unmute" : "🔇 Mute"}
            </button>
            <button
              onClick={endCall}
              disabled={!inCall}
              className="bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 transition-all"
            >
              ❌ End Call
            </button>
          </div>
        </>
      )}

      <div className="w-full max-w-3xl h-72 overflow-y-auto border border-gray-200 rounded-2xl bg-white p-6 shadow-inner mb-8 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm">
            <span className="font-semibold text-blue-600">
              {msg.senderId === userId ? "User" : "Driver"}:
            </span>{" "}
            <span className="text-gray-800">{msg.message}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-10 w-full max-w-4xl">
        <div className="flex flex-col flex-1">
          <label className="text-sm font-semibold mb-1 text-gray-700">User Message</label>
          <input
            type="text"
            placeholder="Type a message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage(userId, driverId, userInput, setUserInput)
            }
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <button
            onClick={() => sendMessage(userId, driverId, userInput, setUserInput)}
            className="bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md"
          >
            Send as User
          </button>
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-sm font-semibold mb-1 text-gray-700">Driver Message</label>
          <input
            type="text"
            placeholder="Type a message..."
            value={driverInput}
            onChange={(e) => setDriverInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage(driverId, userId, driverInput, setDriverInput)
            }
            className="p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <button
            onClick={() => sendMessage(driverId, userId, driverInput, setDriverInput)}
            className="bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md"
          >
            Send as Driver
          </button>
        </div>
      </div>

      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
};

export default ChatAndCall;
