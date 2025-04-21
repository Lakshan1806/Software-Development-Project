import { createContext, useContext, useState } from 'react';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [call, setCall] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const startCall = (userId) => {
    setCall({ to: userId, from: 'current-user' });
  };

  const answerCall = () => {
    setCallAccepted(true);
  };

  const endCall = () => {
    setCall(null);
    setCallAccepted(false);
  };

  return (
    <CallContext.Provider value={{ 
      call, 
      callAccepted, 
      startCall, 
      answerCall, 
      endCall 
    }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);