import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // ✅ Fetch full user and attach
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token error:', error);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

export default protect;
