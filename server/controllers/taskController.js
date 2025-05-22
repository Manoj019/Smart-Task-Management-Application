// controllers/taskController.js
const pool = require('../config/sql');

exports.createTask = async (req, res) => {
  const { name, description, category, due_date, status } = req.body;
  const user_id = req.user.id; // This comes from JWT middleware
  try {
    const sql = `
      INSERT INTO tasks (name, description, category, due_date, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      name, description, category, due_date, status, user_id
    ]);

    res.status(201).json({
      message: 'Task created successfully',
      taskId: result.insertId,
    });
  } catch (error) {
    console.error('Error inserting task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};
exports.getTasks = async (req, res) => {
  const userId = req.user.id;

  try {
    const sql = `SELECT * FROM tasks WHERE user_id = ?`;
    const [rows] = await pool.execute(sql, [userId]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};
