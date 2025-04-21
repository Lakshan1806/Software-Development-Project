import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import CallButton from './CallButton';
import IncomingCall from './IncomingCall';
import ActiveCall from './ActiveCall';

function Communication() {
  // State management
  const [socket, setSocket] = useState(null);
  const [call, setCall] = useState(null);
  const [callStatus, setCallStatus] = useState({
    accepted: false,
    rejected: false,
    ended: false
  });
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket']
    });

    const handleActiveUsers = (users) => {
      setActiveUsers(users);
    };

    newSocket.on('active-users', handleActiveUsers);
    setSocket(newSocket);

    return () => {
      newSocket.off('active-users', handleActiveUsers);
      newSocket.disconnect();
    };
  }, []);

  // Register current user (should be replaced with actual user ID from auth)
  useEffect(() => {
    if (socket) {
      socket.emit('register-user', 'current-user');
    }
  }, [socket]);

  // Clean up media streams and connections
  const cleanupMedia = useCallback(() => {
    if (peerConnection) {
      peerConnection.onicecandidate = null;
      peerConnection.ontrack = null;
      peerConnection.oniceconnectionstatechange = null;
      peerConnection.close();
    }

    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
    }

    setPeerConnection(null);
    setLocalStream(null);
    setRemoteStream(null);
  }, [peerConnection, localStream]);

  // End call handler
  const endCall = useCallback(() => {
    cleanupMedia();
    setCall(null);
    setCallStatus(prev => ({ ...prev, accepted: false, ended: true }));
    setTimeout(() => setCallStatus(prev => ({ ...prev, ended: false })), 1000);
  }, [cleanupMedia]);

  // Start a call
  const startCall = useCallback(async (userId) => {
    if (!socket || !userId) return;

    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            to: userId,
            candidate: event.candidate
          });
        }
      };

      pc.ontrack = (event) => {
        if (!remoteStream) {
          const newRemoteStream = new MediaStream();
          setRemoteStream(newRemoteStream);
        }
        event.streams[0].getTracks().forEach(track => {
          remoteStream?.addTrack(track);
        });
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'disconnected') {
          endCall();
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('call-user', {
        to: userId,
        from: 'current-user',
        offer: offer
      });

      setPeerConnection(pc);
      setLocalStream(stream);
      setCall({ to: userId, from: 'current-user' });
    } catch (error) {
      console.error('Error starting call:', error);
      endCall();
    } finally {
      setIsLoading(false);
    }
  }, [socket, remoteStream, endCall]);

  // Answer a call
  const answerCall = useCallback(async () => {
    if (!socket || !call) return;

    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            to: call.from,
            candidate: event.candidate
          });
        }
      };

      pc.ontrack = (event) => {
        if (!remoteStream) {
          const newRemoteStream = new MediaStream();
          setRemoteStream(newRemoteStream);
        }
        event.streams[0].getTracks().forEach(track => {
          remoteStream?.addTrack(track);
        });
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'disconnected') {
          endCall();
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(call.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('make-answer', {
        to: call.from,
        answer: answer
      });

      setPeerConnection(pc);
      setLocalStream(stream);
      setCallStatus(prev => ({ ...prev, accepted: true }));
    } catch (error) {
      console.error('Error answering call:', error);
      endCall();
    } finally {
      setIsLoading(false);
    }
  }, [socket, call, remoteStream, endCall]);

  // Reject a call
  const rejectCall = useCallback(() => {
    if (socket && call) {
      socket.emit('reject-call', { to: call.from });
      setCallStatus(prev => ({ ...prev, rejected: true }));
      setTimeout(() => setCallStatus(prev => ({ ...prev, rejected: false })), 3000);
      endCall();
    }
  }, [socket, call, endCall]);

  // Send a message
  const sendMessage = useCallback(() => {
    if (socket && selectedUser && messageInput.trim()) {
      const newMessage = {
        from: 'current-user',
        to: selectedUser,
        message: messageInput.trim(),
        timestamp: new Date()
      };
      
      socket.emit('send-message', newMessage);
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
    }
  }, [socket, selectedUser, messageInput]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleCallMade = (data) => {
      setCall({
        from: data.from,
        offer: data.offer,
        socket: data.socket
      });
    };

    const handleAnswerMade = async (data) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
      setCallStatus(prev => ({ ...prev, accepted: true }));
    };

    const handleCallRejected = () => {
      endCall();
      setCallStatus(prev => ({ ...prev, rejected: true }));
      setTimeout(() => setCallStatus(prev => ({ ...prev, rejected: false })), 3000);
    };

    const handleIceCandidate = async (data) => {
      if (peerConnection && data.candidate) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    };

    const handleReceiveMessage = (data) => {
      setMessages(prev => [...prev, data]);
    };

    socket.on('call-made', handleCallMade);
    socket.on('answer-made', handleAnswerMade);
    socket.on('call-rejected', handleCallRejected);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('call-made', handleCallMade);
      socket.off('answer-made', handleAnswerMade);
      socket.off('call-rejected', handleCallRejected);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [socket, peerConnection, endCall]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter messages for the selected user
  const filteredMessages = messages.filter(msg => 
    msg.from === selectedUser || msg.to === selectedUser || 
    (msg.from === 'current-user' && msg.to === selectedUser)
  );
  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with active users */}
      <div className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Active Users</h2>
        <ul>
          {activeUsers.map(user => (
            <li 
              key={user.id} 
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                selectedUser === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedUser(user.id)}
            >
              <div className="flex items-center">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="truncate">{user.name || `User ${user.id}`}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {selectedUser ? 
              `Chat with ${activeUsers.find(u => u.id === selectedUser)?.name || `User ${selectedUser}`}` : 
              'Select a user to chat'
            }
          </h2>
          {selectedUser && (
            <CallButton 
              userId={selectedUser} 
              startCall={startCall} 
              disabled={isLoading || call}
            />
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              {selectedUser ? 'No messages yet. Start the conversation!' : 'Select a user to view messages'}
            </div>
          ) : (
            filteredMessages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 ${message.from === 'current-user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                    message.from === 'current-user' ? 
                    'bg-blue-500 text-white' : 
                    'bg-gray-200'
                  }`}
                >
                  {message.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={selectedUser ? "Type a message..." : "Select a user to chat"}
              className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              disabled={!selectedUser}
            />
            <button
              onClick={sendMessage}
              disabled={!selectedUser || !messageInput.trim()}
              className="bg-blue-500 text-white px-4 rounded-r-lg disabled:bg-blue-300 hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Call components */}
      {call && !callStatus.accepted && !callStatus.rejected && (
        <IncomingCall 
          answerCall={answerCall} 
          rejectCall={rejectCall} 
          caller={call.from} 
          isLoading={isLoading}
        />
      )}
      
      {callStatus.accepted && (
        <ActiveCall 
          endCall={endCall} 
          localStream={localStream}
          remoteStream={remoteStream}
        />
      )}
      
      {callStatus.rejected && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          Call rejected
        </div>
      )}
      
      {callStatus.ended && (
        <div className="fixed bottom-4 right-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          Call ended
        </div>
      )}
    </div>
  );
}

export default Communication;