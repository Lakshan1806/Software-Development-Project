/* import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
  const handleSuccess = (credentialResponse) => {
    console.log('Google Credential Response:', credentialResponse);
    // Send credentialResponse to the backend
    fetch("http://localhost:5000/auth/google/callback", { // Fixed the quote
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential })
    }).then((res) => {
        if (!res.ok) throw new Error("Failed to authenticate with Google");
        return res.json();
      })
      .then((data) => {
        console.log("Server Response:", data);
        // Handle success (e.g., save user data, redirect)
      })
      .catch((err) => console.error("Error:", err));
  };

  const handleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};

export default GoogleLoginButton;
 */