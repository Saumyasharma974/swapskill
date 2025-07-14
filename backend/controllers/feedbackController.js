import Feedback from "../models/Feedback.models.js";

export const giveFeedback = async (req, res) => {
  try {
    const { swapId, receivedBy, rating, comment } = req.body;

    if (!swapId || !receivedBy || !rating) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    const feedback = await Feedback.create({
      swapId,
      givenBy: req.user.id,
      receivedBy,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Give Feedback Error:", error.message);
    res.status(500).json({ msg: "Server error while submitting feedback" });
  }
};

export const getFeedbackForUser = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ receivedBy: req.params.userId });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Get Feedback Error:", error);
    res.status(500).json({ msg: "Server error while fetching feedback" });
  }
};
