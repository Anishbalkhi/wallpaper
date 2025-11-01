import mongoose from 'mongoose';
import User from './src/models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`✅ ${email} is now an ADMIN!`);
      console.log('User details:', {
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      console.log(`❌ User ${email} not found`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Get email from command line
const email = process.argv[2];
if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js admin@example.com');
  process.exit(1);
}

makeAdmin(email);