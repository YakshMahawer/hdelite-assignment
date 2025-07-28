// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await user.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.checkUser = async (req, res) => {
    const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch {
    res.status(500).json({ exists: false });
  }
}

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP after verification
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, dob } = req.body;
    const userId = req.user.id;

    if (!name || !dob) {
      return res.status(400).json({ message: 'Name and DOB are required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, dob },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Profile update failed' });
  }
};

exports.getme = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ name: user.name || 'User', email: user.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid token' });
  }
};

exports.googleSignIn = async (req, res) => {
  const { idToken } = req.body;
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, email });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Google sign-in failed' });
  }
};
