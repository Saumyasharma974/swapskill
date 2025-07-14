import express from 'express';
import { getProfile, updateProfile, searchUsers } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
const router = express.Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, upload.single('photoUrl'), updateProfile);
router.get('/search', protect, searchUsers);

export default router;

