const User = require('../models/User');
const jwt = require("jsonwebtoken")

const secret = process.env.JWT_SECRET; 


const isAdmin = (req, res, next) => {
    console.log('User Role:', req.user.role);
    if (req.user && req.user.role === "admin") {
      next(); 
    } else {
      res.status(403).json({ message: 'Permission denied. Only admins can perform this operation.' });
    }
  };
module.exports ={
  isAdmin
}