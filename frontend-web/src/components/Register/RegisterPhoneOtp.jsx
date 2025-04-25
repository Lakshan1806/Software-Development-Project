import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import OtpInput from '../otp-input';
import useCountDown from '../hooks/useCountdown';

const RegisterPhoneOtp = ({ formData, setFormData, handleNext }) => {
  const { seconds, startCountdown, isActive } = useCountDown(60);

  const verifyPhoneOtp = async () => {
    try {
      const { data } = await axios.post('/api/auth/register', {
        step: 'verify-phone',
        phone: formData.phone,
        otp: formData.phoneOtp,
      });
      toast.success(data.message);
      handleNext();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post('/api/auth/resend-otp', { phone: formData.phone });
      toast.success('OTP resent');
      startCountdown();
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div>
      <h2>Enter Phone OTP</h2>
      <OtpInput
        value={formData.phoneOtp}
        onChange={(val) => setFormData({ ...formData, phoneOtp: val })}
      />
      <button onClick={verifyPhoneOtp}>Verify OTP</button>
      <button onClick={resendOtp} disabled={isActive}>
        {isActive ? `Resend in ${seconds}s` : 'Resend OTP'}
      </button>
    </div>
  );
};

export default RegisterPhoneOtp;
