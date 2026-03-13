const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET || 'dev_secret', {
    expiresIn: '7d'
  });

const register = async (req, res) => {
  try {
    const { name, phone, password, storeName, storeCategory, language } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ message: 'Phone already registered' });

    const user = await User.create({ name, phone, password, storeName, storeCategory, language });
    return res.status(201).json({ token: generateToken(user), user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({ token: generateToken(user), user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const profile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  return res.json(user);
};

module.exports = { register, login, profile };
