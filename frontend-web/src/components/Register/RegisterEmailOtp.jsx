import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import OtpInput from '../otp-input';
import useCountDown from '../hooks/useCountdown';

const RegisterEmailOtp = ({ formData, setFormData, navigate }) => {
  const { seconds, startCountdown, isActive } = useCountDown(60);

  const verifyEmailOtp = async () => {
    try {
      const { data } = await axios.post('/api/auth/register', {
        step: 'verify-email',
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        email: formData.email,
        otp: formData.emailOtp,
      });
      toast.success('Account created successfully');
      navigate('/account-created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post('/api/auth/resend-otp', { email: formData.email });
      toast.success('OTP resent');
      startCountdown();
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div>
      <h2>Enter Email OTP</h2>
      <OtpInput
        value={formData.emailOtp}
        onChange={(val) => setFormData({ ...formData, emailOtp: val })}
      />
      <button onClick={verifyEmailOtp}>Verify & Create Account</button>
      <button onClick={resendOtp} disabled={isActive}>
        {isActive ? `Resend in ${seconds}s` : 'Resend OTP'}
      </button>
    </div>
  );
};

export default RegisterEmailOtp;
