
const User = require('../models/User');
const jwt = require("jsonwebtoken")

const secret = process.env.JWT_SECRET; 
console.log('JWT_SECRET:', secret);
const { promisify } = require('util');

const verifyToken = promisify(jwt.verify);

const authenticateUser = async (req, res, next) => {
    let token = req.headers.token;
 
    console.log('Received Token:', token);
  
    try {
      if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
      }
      console.log('Received Token:', token);
      // Verify the token and extract user data
      let decodedData = await jwt.verify(token ,secret)
  
      console.log('Decoded Token Data:', decodedData); 
      if (decodedData) {
        // If token is valid, attach decoded data to the request
        req.user =  decodedData ;
        next();
      } else {
        res.status(401).json({ message: 'Invalid token' });
      }
    } catch (err) {
      // Handle any errors during token verification
      console.error(err); 
      res.status(500).json({ message: 'Authentication failed', error: err.message });
    }
  };
module.exports={
  authenticateUser
}