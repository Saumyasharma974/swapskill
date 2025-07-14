import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  skillOffered: String,
  skillRequested: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

const SwapRequest = mongoose.model('SwapRequest', swapSchema);
export default SwapRequest;