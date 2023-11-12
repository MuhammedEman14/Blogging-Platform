const express = require('express');
const router = express.Router();
const {register,login,getUserProfile,updateUserProfile,followUser, unfollowUser,getNotifications, viewAllUsers,
    blockUser,deleteUser} = require('../controllers/authenticationController');
const  {authenticateUser}  = require('../middleware/authenticationMiddleware');
const  {isAdmin}  = require('../middleware/adminMiddleware');
router.post('/register', register);
router.post('/login',login);
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);
router.post('/follow/:userEmailToFollow', authenticateUser, followUser);
router.delete('/unfollow/:userEmailToUnfollow',authenticateUser , unfollowUser);
router.get('/notifications', authenticateUser, getNotifications);
router.get('/users',authenticateUser, isAdmin, viewAllUsers);
router.put('/block-user/:userId', authenticateUser,isAdmin, blockUser);
router.delete('/users/:email', authenticateUser,isAdmin,deleteUser);
module.exports = router;
