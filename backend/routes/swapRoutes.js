import express from 'express';
import multer from 'multer';
import {
  createSwap,
  getMySwaps,
  updateSwapStatus,
  deleteSwap
} from '../controllers/swapController.js';
import protect from '../middleware/authMiddleware.js';


const router = express.Router();
const upload = multer(); // no storage needed for no files

// 👇 Add .none() to parse form-data fields
router.post('/', protect, upload.none(), createSwap);
router.get('/', protect, getMySwaps);
router.put('/:id', protect,  upload.none(),updateSwapStatus);
router.delete('/:id', protect,  deleteSwap);

export default router;
