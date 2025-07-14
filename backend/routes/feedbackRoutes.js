import express from 'express';
import { giveFeedback, getFeedbackForUser } from '../controllers/feedbackController.js';
import protect from '../middleware/authMiddleware.js';
import multer from 'multer';
const router = express.Router();
const upload = multer(); 

router.post('/', protect, upload.none(), giveFeedback);
router.get('/:userId', getFeedbackForUser);

export default router;