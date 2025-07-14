import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  swapId: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest' },
  givenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;