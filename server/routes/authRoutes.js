//authroute.js
const express = require('express');
const router = express.Router();
const User = require('../models/createuser'); // Adjust path if needed

const { registerUser, loginUser, getUserProfile,createNewUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const requireAuth=require('../models/createuser')
const {getAllCreatedUsers}  = require('../controllers/adminController');
// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

//create new user
router.post('/createuser', protect, createNewUser)

//deactivate created acctount
// Middleware: requireAuth to validate JWT
router.delete('/delete/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const userToDelete = await User.findById(id);
    if (!userToDelete || userToDelete.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this user" });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error in /delete/:id route:", err);
    res.status(500).json({ message: "Server error" });
  }
});




//get created users 
router.get('/createduser', protect, getAllCreatedUsers);


// Get user profile (protected route)
router.get('/profile', protect, getUserProfile);

module.exports = router;
