import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login.tsx';
import VerifyOtp from './components/VerifyOtp.tsx';
import Welcome from './components/Welcome.tsx';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/welcome" element={<Welcome />} />
    </Routes>
  );
};

export default App;

