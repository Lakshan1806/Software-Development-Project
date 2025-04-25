import React from 'react';
import PasswordStrengthMeter from '../PasswordStrengthMeter';

const RegisterUsernamePassword = ({ formData, setFormData, handleNext }) => {
  return (
    <div>
      <h2>Create Account</h2>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <PasswordStrengthMeter password={formData.password} />
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default RegisterUsernamePassword;
