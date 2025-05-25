const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

// POST route to add a new task
router.post('/', protect, createTask);

// GET route to fetch user's tasks
router.get('/', protect, getTasks);

// PUT route to update a task by ID
router.put('/:id', protect, updateTask); // 

// DELETE route to delete a task by ID
router.delete('/:id', protect, deleteTask); // 

module.exports = router;
