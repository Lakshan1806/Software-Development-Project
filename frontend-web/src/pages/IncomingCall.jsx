const IncomingCall = ({ answerCall, rejectCall, caller }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
          <h3 className="text-xl font-bold mb-2">Incoming Call</h3>
          <p className="mb-6">From: User {caller}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={answerCall}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              Answer
            </button>
            <button
              onClick={rejectCall}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default IncomingCall;