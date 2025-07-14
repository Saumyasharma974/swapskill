// makeAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.models.js'; // adjust path if needed

dotenv.config(); // Load .env variables

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'test1@test.com'; // ✅ replace with the user you want to make admin

    const user = await User.findOneAndUpdate(
      { email },
      { isAdmin: true },
      { new: true }
    );

    if (user) {
      console.log(`✅ SUCCESS: ${user.email} is now an admin.`);
    } else {
      console.log(`❌ ERROR: User not found with email: ${email}`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Failed to update user:', err);
    process.exit(1);
  }
};

makeAdmin();
