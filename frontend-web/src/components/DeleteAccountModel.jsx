import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteAccountModal = ({ userId, onClose, onSuccess }) => {
  const [deleteReason, setDeleteReason] = useState("");

  const handleAccountDeletion = async () => {
    try {
      const response = await axios.delete("/auth/delete-account", {
        data: {
          userId,
          reason: deleteReason,
        },
      });

      if (response.data.success) {
        toast.success("Account deleted successfully");

        await onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Deletion failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50  flex items-center justify-center p-4">
      <div className="bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-center">Delete Account</h3>
        <p className="mb-4 text-center">
          This will permanently remove your account. All data will be archived.
        </p>

        <textarea
          placeholder="Reason for deletion (optional)"
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows={3}
        />

        <div className="flex justify-end gap-2">
        <div
              className={`bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] mx-2 text-[20px] `}
            > 
          <button
            onClick={onClose}
            className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
            >
            Cancel
          </button>
          </div>
          <div
              className={`bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] mx-2 text-[20px] `}
            > 
          <button
            onClick={handleAccountDeletion}
            className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
            >
            confirm deletion
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
