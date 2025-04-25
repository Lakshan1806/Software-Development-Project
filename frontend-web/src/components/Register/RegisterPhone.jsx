import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPhone = ({ formData, setFormData, handleNext }) => {
  const [loading, setLoading] = useState(false);

  const sendPhoneOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/register', {
        step: 'phone',
        phone: formData.phone,
      });
      toast.success(data.message);
      handleNext();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Enter Phone Number</h2>
      <input
        type="text"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <button onClick={sendPhoneOtp} disabled={loading}>
        {loading ? 'Sending...' : 'Send OTP'}
      </button>
    </div>
  );
};

export default RegisterPhone;
