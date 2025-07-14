import User from "../models/user.models.js";


const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user && user.isAdmin) {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied: Admins only' });
  }
};

export default isAdmin;