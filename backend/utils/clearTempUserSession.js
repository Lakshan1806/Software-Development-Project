const clearTempUserSession = (session) => {
    if (session && session.tempUser) {
      delete session.tempUser; 
    }
  };
  
  export default clearTempUserSession;
  