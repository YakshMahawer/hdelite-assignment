import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState('');
  const email = localStorage.getItem('email') || '';
  const navigate = useNavigate();

  const verifyOtp = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        email,
        otp,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/welcome');
    } catch {
      alert('Invalid or expired OTP');
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOtp}>Verify</button>
    </div>
  );
};

export default VerifyOtp;
