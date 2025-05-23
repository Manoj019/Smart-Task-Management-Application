// controllers/taskController.js
const pool = require('../config/sql');

exports.createTask = async (req, res) => {
  const { name, description, category, due_date, status } = req.body;
  const user_id = req.user.id;
  try {
    const sql = `
      INSERT INTO tasks (name, description, category, due_date, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      name, description, category, due_date, status, user_id,
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

exports.updateTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { name, description, category, due_date, status } = req.body;

  try {
    const sql = `
      UPDATE tasks
      SET name = ?, description = ?, category = ?, due_date = ?, status = ?
      WHERE id = ? AND user_id = ?
    `;
    const [result] = await pool.execute(sql, [
      name, description, category || '', due_date, status, taskId, userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  try {
    const sql = `DELETE FROM tasks WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(sql, [taskId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
