const { Clerk } = require('@clerk/clerk-sdk-node');
const User = require('../models/User.model');

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const createUser = async (clerkUser) => {
  try {
    const existingUser = await User.findOne({ clerkId: clerkUser.id });
    if (existingUser) return existingUser;

    const user = new User({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      name: clerkUser.fullName || '',
      avatar: clerkUser.imageUrl || ''
    });

    await user.save();
    return user;
  } catch (error) {
    console.error('Create User Error:', error);
    throw error;
  }
};

const getUserByClerkId = async (clerkId) => {
  try {
    let user = await User.findOne({ clerkId });
    if (!user) {
      try {
        const clerkUser = await clerk.users.getUser(clerkId);
        user = await createUser(clerkUser);
      } catch (err) {
        console.error('Clerk User Error:', err);
        return null;
      }
    }
    return user;
  } catch (error) {
    console.error('Get User Error:', error);
    throw error;
  }
};

const updateUser = async (clerkId, updates) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkId },
      updates,
      { new: true }
    );
    return user;
  } catch (error) {
    console.error('Update User Error:', error);
    throw error;
  }
};

const deleteUser = async (clerkId) => {
  try {
    await User.findOneAndDelete({ clerkId });
  } catch (error) {
    console.error('Delete User Error:', error);
    throw error;
  }
};

const getUserProfile = async (clerkId) => {
  try {
    const user = await User.findOne({ clerkId });
    if (!user) {
      return await getUserByClerkId(clerkId);
    }
    return user;
  } catch (error) {
    console.error('Get User Profile Error:', error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByClerkId,
  updateUser,
  deleteUser,
  getUserProfile
};