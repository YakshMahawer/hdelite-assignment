import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const navigate = useNavigate();

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!email) return setError('Please enter your email');
    if (!isValidEmail(email)) return setError('Invalid email format');

    if (isSignUp) {
      if (!name || !dob) return setError('Please enter name and date of birth');
    }

    setError('');
    setLoading(true);

    try {
      // Check if user exists in Sign In mode
      if (!isSignUp) {
        const checkRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/check-user`,
          { email }
        );
        if (!checkRes.data.exists) {
          setIsSignUp(true);
          setError('No such user. Kindly sign up.');
          setLoading(false);
          return;
        }
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, { email });
      setOtpSent(true);
    } catch {
      setError('Failed to send OTP');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError('Please enter the OTP');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        { email, otp }
      );

      if (keepLoggedIn) {
        localStorage.setItem('token', res.data.token);
      } else {
        sessionStorage.setItem('temp_token', res.data.token);
      }

      localStorage.setItem('email', email);

      if (isSignUp) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/update-profile`,
          { name, dob },
          {
            headers: {
              Authorization: `Bearer ${
                keepLoggedIn
                  ? localStorage.getItem('token')
                  : sessionStorage.getItem('temp_token')
              }`,
            },
          }
        );
      }

      navigate('/welcome');
    } catch {
      setError('Invalid or expired OTP');
    }
  };

  const handleGoogleLogin = async (res: any) => {
    try {
      const r = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
        idToken: res.credential,
      });
      if (keepLoggedIn) {
        localStorage.setItem('token', r.data.token);
      } else {
        sessionStorage.setItem('temp_token', r.data.token);
      }
      localStorage.setItem('email', r.data.email);
      navigate('/welcome');
    } catch {
      setError('Google login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo"><svg width="47" height="32" viewBox="0 0 47 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.6424 0.843087L24.4853 0L21.8248 9.89565L19.4228 0.961791L16.2656 1.80488L18.8608 11.4573L12.3967 5.01518L10.0855 7.31854L17.1758 14.3848L8.34596 12.0269L7.5 15.1733L17.1477 17.7496C17.0372 17.2748 16.9788 16.7801 16.9788 16.2717C16.9788 12.6737 19.9055 9.75685 23.5159 9.75685C27.1262 9.75685 30.0529 12.6737 30.0529 16.2717C30.0529 16.7768 29.9952 17.2685 29.8861 17.7405L38.6541 20.0818L39.5 16.9354L29.814 14.3489L38.6444 11.9908L37.7984 8.84437L28.1128 11.4308L34.5768 4.98873L32.2656 2.68538L25.2737 9.65357L27.6424 0.843087Z" fill="#367AFF"/>
<path d="M29.8776 17.7771C29.6069 18.9176 29.0354 19.9421 28.2513 20.763L34.6033 27.0935L36.9145 24.7901L29.8776 17.7771Z" fill="#367AFF"/>
<path d="M28.1872 20.8292C27.3936 21.637 26.3907 22.2398 25.2661 22.5504L27.5775 31.1472L30.7346 30.3041L28.1872 20.8292Z" fill="#367AFF"/>
<path d="M25.1482 22.5818C24.6264 22.7155 24.0795 22.7866 23.5159 22.7866C22.9121 22.7866 22.3274 22.705 21.7723 22.5522L19.4589 31.1569L22.616 31.9999L25.1482 22.5818Z" fill="#367AFF"/>
<path d="M21.6607 22.5206C20.5532 22.1945 19.5682 21.584 18.7908 20.7739L12.4232 27.1199L14.7344 29.4233L21.6607 22.5206Z" fill="#367AFF"/>
<path d="M18.7377 20.7178C17.9737 19.9026 17.4172 18.8917 17.1523 17.7688L8.35571 20.1178L9.20167 23.2642L18.7377 20.7178Z" fill="#367AFF"/>
</svg>
<span>HD</span></div>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <p className="subtitle">Sign up to enjoy the feature of HD</p>

        {error && <div className="error-box">{error}</div>}

        {isSignUp && (
          <>
            <input
              className="input-field"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input-field"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </>
        )}

        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!otpSent ? (
          <button className="get-otp-button" onClick={handleSendOtp} disabled={loading}>
            {loading ? 'Sending OTP...' : 'Get OTP'}
          </button>
        ) : (
          <>
              <input
                className="input-field"
                type={showOtp ? 'text' : 'password'}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="resend-otp-button" onClick={handleSendOtp}>
              Resend OTP
            </p>
            <button className="get-otp-button" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        <label className="checkbox">
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={() => setKeepLoggedIn(!keepLoggedIn)}
          />
          Keep me logged in
        </label>

        <div className="signin-text">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            className="signin-link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setOtpSent(false);
              setError('');
              setOtp('');
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </div>

        <div className="or-divider">or</div>

        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert('Google Login Failed')}
          />
        </div>
      </div>

      <div className="login-right">
        <img
          className="login-image"
          src="https://highway-delite-assessment-xtnf.vercel.app/static/media/rightimg.847081c313aacc568671.jpg"
          alt="illustration"
        />
      </div>
    </div>
  );
};

export default Login;
