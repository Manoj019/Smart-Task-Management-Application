const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware'); // ✅ import middleware

// POST route to add a new task (protected)
router.post('/', protect, createTask);

// GET route to fetch user's tasks (protected)
router.get('/', protect, getTasks);

module.exports = router;
