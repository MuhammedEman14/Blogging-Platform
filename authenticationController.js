const User = require('../models/User');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const register = async (req, res) => {
  try {
    // Extract user registration data from the request body
    const { username, email, password ,role} = req.body;

    // Hash the user's password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = new User({ username, email, password: hashedPassword ,role});
    await newUser.save();

    // Send a success response without a token
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    // Handle registration error
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};



const login = async (req, res) => {
  try {
    // Extract user login data from the request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalide credentials' });
    }

    // Validate user's password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    // Generate a JWT token for the user
    const token = user.generateAuthToken(); 
    // Return the token as a response
    res.json({ token });
    
  } catch (error) {
    // Handle login error
    res.status(500).json({ error: 'Login failed', details: error.message});
  }
};


const getUserProfile = async (req, res) => {
  try {
    // Extract user ID from the JWT token
    const userId = req.user.email;
    console.log('User ID:', userId);
    // Find the user in the database using the user ID
    const user = await User.findOne({ email: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const userProfile = {
      username: user.username,
      email: user.email,
      role: user.role,
     
    };

    return res.json(userProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // Extract user email from the JWT token
    const userEmail = req.user.email;

    // Update the user's profile data based on the user email from the token
    const updatedProfileData = req.body;

    // Find and update the user in the database using the email
    const user = await User.findOneAndUpdate({ email: userEmail }, updatedProfileData, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the updated user's profile data
    const userProfile = {
      username: user.username,
      email: user.email,
      role: user.role,
      // Add other profile data fields as needed
    };

    return res.json(userProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// const followUser = async (req, res) => {
//   try {
//     const { userEmailToFollow } = req.params;
//     const followerEmail = req.user.email;

//     // Check if the follow relationship already exists
//     const isAlreadyFollowing = req.user.following && req.user.following.includes(userEmailToFollow);


//     if (isAlreadyFollowing) {
//       return res.status(400).json({ message: 'You are already following this user' });
//     }

//     await User.findOneAndUpdate(
//       { email: followerEmail },
//       { $addToSet: { following: userEmailToFollow } }
//     );

//     // Update the user being followed
//     await User.findOneAndUpdate(
//       { email: userEmailToFollow },
//       { $addToSet: { followers: followerEmail } }
//     );
// console.log(userEmailToFollow);

//     res.json({ message: 'User followed successfully' });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

const followUser = async (req, res) => {
  try {
    const { userEmailToFollow } = req.params;
    const followerEmail = req.user.email;

    // Check if the follow relationship already exists
    const isAlreadyFollowing = req.user.following && req.user.following.includes(userEmailToFollow);

    if (isAlreadyFollowing) {
      return res.status(400).json({ message: 'You are already following this user' });
    }

    await User.findOneAndUpdate(
      { email: followerEmail },
      { $addToSet: { following: userEmailToFollow } }
    );

    // Update the user being followed
    await User.findOneAndUpdate(
      { email: userEmailToFollow },
      { $addToSet: { followers: followerEmail } }
    );

    // Create a follower notification
    const followedUser = await User.findOne({ email: userEmailToFollow });
    followedUser.notifications.push({
      sender: req.user.email,
      type: 'follower',
      read: false,
    });
    await followedUser.save();

    res.json({ message: 'User followed successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const unfollowUser = async (req, res) => {
  try {
    const { userEmailToUnfollow } = req.params;
    const followerEmail = req.user.email;

    // Update the follower user
    await User.findOneAndUpdate(
      { email: followerEmail },
      { $pull: { following: userEmailToUnfollow } }
    );

    // Update the user being unfollowed
    await User.findOneAndUpdate(
      { email: userEmailToUnfollow },
      { $pull: { followers: followerEmail } }
    );
    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getNotifications = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Find the user and retrieve the notifications array
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followerNotifications = user.notifications.filter(notification => notification.type === 'follower');
    const commentNotifications = user.notifications.filter(notification => notification.type === 'comment');

    res.json({
      followerNotifications,
      commentNotifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const viewAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email role');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Update user status to blocked or disabled
    await User.findByIdAndUpdate(userId, { $set: { status: 'blocked' } });
    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteUser= async (req, res) => {
  try {
    const { email } = req.params;


    // Find and delete the user based on email
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getNotifications,
  viewAllUsers,
  blockUser,
  deleteUser,
};
