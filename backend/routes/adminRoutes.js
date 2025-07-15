import express from 'express';

// Middleware
import protect from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/adminMiddleware.js';

// Models
import User from '../models/user.models.js';
import SwapRequest from '../models/swapRequest.model.js';
import Feedback from '../models/Feedback.models.js';

const router = express.Router();

// ✅ Get all users (admin only)
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Failed to fetch users:', err);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// ✅ Ban or Unban user (toggle visibility)
router.put('/ban-user/:id', protect, isAdmin, async (req, res) => {
  try {
    const { isPublic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isPublic },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error('Failed to ban user:', err);
    res.status(500).json({ message: 'Server error while banning user' });
  }
});

// ✅ Get all swap requests
router.get('/swaps', protect, isAdmin, async (req, res) => {
  try {
    const swaps = await SwapRequest.find().populate('fromUser toUser', 'name email');
    res.json(swaps);
  } catch (err) {
    console.error('Failed to fetch swaps:', err);
    res.status(500).json({ message: 'Server error while fetching swaps' });
  }
});

// ✅ Update swap status (accept/reject/pending)
router.put('/swaps/:id', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedSwap = await SwapRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('fromUser toUser', 'name email');

    if (!updatedSwap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    res.json(updatedSwap);
  } catch (err) {
    console.error('Failed to update swap status:', err);
    res.status(500).json({ message: 'Server error while updating swap status' });
  }
});

// ✅ Get all feedbacks
router.get('/feedbacks', protect, isAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('givenBy receivedBy', 'name');
    res.json(feedbacks);
  } catch (err) {
    console.error('Failed to fetch feedbacks:', err);
    res.status(500).json({ message: 'Server error while fetching feedbacks' });
  }
});

export default router;
