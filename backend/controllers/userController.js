import Feedback from "../models/Feedback.models.js";
import User from "../models/user.models.js";


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const feedbacks = await Feedback.find({ receivedBy: user._id });

    const averageRating = feedbacks.length
      ? (
          feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
        ).toFixed(1)
      : null;

    res.json({
      ...user._doc,
      averageRating,
      totalFeedbacks: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ msg: "Server error while getting profile" });
  }
};
  
export const updateProfile = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
  res.json(updated);
};

export const searchUsers = async (req, res) => {
  try {
    const { skill } = req.query;

    // Step 1: Find public users matching the skill
    const users = await User.find({
      isPublic: true,
      skillsOffered: { $regex: skill || '', $options: 'i' }
    }).select('-password');

    // Step 2: Add average rating to each user
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const feedbacks = await Feedback.find({ receivedBy: user._id });

        const avgRating = feedbacks.length
          ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
          : null;

        return {
          ...user._doc,
          averageRating: avgRating,
          totalFeedbacks: feedbacks.length
        };
      })
    );

    res.status(200).json(enrichedUsers);
  } catch (error) {
    console.error("Search Users Error:", error);
    res.status(500).json({ msg: "Server error while searching users" });
  }
};

