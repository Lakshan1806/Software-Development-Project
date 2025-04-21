import { useRef, useEffect } from 'react';

const ActiveCall = ({ endCall, remoteStream }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-xl font-bold mb-6">Call in Progress</h3>
        <audio ref={audioRef} autoPlay playsInline />
        <div className="flex justify-center">
          <button
            onClick={endCall}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveCall;