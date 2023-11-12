const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const base64url = require('base64url');
const secret = process.env.JWT_SECRET;
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
   required: true,
  },
  password: {
    type: String,
    unique: true,
   required: true,
  },
  role: {
    type: String,
    unique: true,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  followers: [
    {
      type: String,
      ref: 'User',
    },
  ],
  following: [
    {
      type: String,
      ref: 'User',
    },
  ],
  notifications: [
    {
      sender: {
        type: String,
        ref: 'User',
      },
      type: {
        type: String,
        enum: ['follower', 'comment'],
      },
      read: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  return bcrypt.compare(candidatePassword, user.password);
};
userSchema.methods.generateAuthToken = function() {
  const user = this;

  const payload = {
    userId: user._id,
    email: user.email,
    role:user.role,
  };

  const expiresIn = '1h';

  // Generate the token using jwt.sign
  const token = jwt.sign(payload, secret, { expiresIn });
 
  return token;

};
const User = mongoose.model('User', userSchema);
module.exports = User;
