const Users = require('../models/createuser');

const getAllCreatedUsers = async (req, res) => {
  try {
    const users = await Users.find({ createdBy: req.user.id, isActive: true}); // Add filtering logic if needed
    res.json(users);
  } catch (err) {
     console.error('Error in getCreatedUsers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { getAllCreatedUsers };
