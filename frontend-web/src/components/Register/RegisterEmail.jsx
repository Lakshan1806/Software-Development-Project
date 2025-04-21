import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterEmail = ({ formData, setFormData, handleNext }) => {
  const [loading, setLoading] = useState(false);

  const sendEmailOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/register', {
        step: 'email',
        email: formData.email,
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
      <h2>Enter Email</h2>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <button onClick={sendEmailOtp} disabled={loading}>
        {loading ? 'Sending...' : 'Send OTP'}
      </button>
    </div>
  );
};

export default RegisterEmail;
