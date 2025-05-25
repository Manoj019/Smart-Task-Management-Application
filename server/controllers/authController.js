// controllers/authController.js
const User = require('../models/user');
const Users = require('../models/createuser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if password field exists and is a string
    if (!user.password || typeof user.password !== 'string') {
      console.error('User password missing or invalid:', user.password);
      return res.status(500).json({ message: 'Server error' });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match:", match);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    try {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ user, token });
    } catch (jwtErr) {
      console.error('JWT Error:', jwtErr);
      return res.status(500).json({ message: 'Token generation failed' });
    }
  } catch (err) {
  console.error('Unexpected login error:', err);
  res.status(500).json({ message: err.message, stack: err.stack });
}
};


const getUserProfile = async (req, res) => {
  try {
    // req.user is set in your protect middleware after JWT verification
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createNewUser = async (req, res) => {
  const { name, email, password, role, isActive } = req.body;

  try {
    const existing = await Users.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await Users.create({
      name,
      email,
      password: hashed,
      role,
      isActive,
      createdBy: req.user.id, // 
    });

    res.status(201).json({ message: 'User created successfully', user });

  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile ,createNewUser};
