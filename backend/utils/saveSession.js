 const saveSession = (session, res, successMessage) => {
  try{
    session.save((err) => {
      if (err) {
        if (!res.headersSent) {
        res.status(500).json({ message: "Server error", error: "Session not saved" });
      }} else {
        if (!res.headersSent) {
          return res.status(200).json({ message: successMessage });
        
      }
    }
    });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ message: "Unexpected server error", error: error.message });
    } else {
      console.error("Headers already sent. Cannot send response. Error:", error);
    }
  }
};

  export default saveSession;
  