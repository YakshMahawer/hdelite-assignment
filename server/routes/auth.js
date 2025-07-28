// routes/auth.js
const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  updateProfile,
  googleSignIn,
  checkUser, 
  getme
} = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/update-profile', auth, updateProfile);
router.post('/google', googleSignIn);
router.post('/check-user', checkUser);
router.get('/me', getme);
module.exports = router;
