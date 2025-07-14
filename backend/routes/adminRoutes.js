import express from 'express';



import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';
import User from '../models/user.models.js';
import SwapRequest from '../models/swapRequest.model.js';
import Feedback from '../models/Feedback.models.js';

const router = express.Router();

router.put('/ban-user/:id', protect, isAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isPublic: false });
  res.json(user);
});

router.get('/swaps', protect, isAdmin, async (req, res) => {
  const swaps = await SwapRequest.find().populate('fromUser toUser', 'name email');
  res.json(swaps);
});

router.get('/feedbacks', protect, isAdmin, async (req, res) => {
  const feedbacks = await Feedback.find().populate('givenBy receivedBy', 'name');
  res.json(feedbacks);
});

export default router;
