import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Task } from '../../types/task';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get<Task[]>('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Map 'id' field from DB response to '_id' so your frontend code works as expected
    const normalizedTasks = res.data.map(task => ({
      ...task,
      _id: task.id, // copy id to _id
    }));

    setTasks(normalizedTasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
  }
};

  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const updateTask = async () => {
    if (!editTask) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/tasks/${editTask.id}`,
        editTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(); // refresh after update
      setEditTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">My Tasks</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="mb-2 sm:mb-0">
              <h3 className="text-lg font-semibold text-gray-800">{task.name}</h3>
              <p className="text-gray-600 text-sm">{task.description}</p>
              <p className="text-gray-500 text-sm">Due: {task.due_date}</p>
              <span className={`inline-block px-2 py-1 text-xs rounded ${task.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                {task.status}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditTask(task)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Task</h3>
            <input
              type="text"
              placeholder="Name"
              className="w-full mb-2 p-2 border rounded"
              value={editTask.name}
              onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full mb-2 p-2 border rounded"
              value={editTask.description}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
            />
            <input
              type="date"
              className="w-full mb-2 p-2 border rounded"
              value={editTask.due_date}
              onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value })}
            />
            <select
              className="w-full mb-4 p-2 border rounded"
              value={editTask.status}
              onChange={(e) => setEditTask({ ...editTask, status: e.target.value as Task['status'] })}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditTask(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={updateTask}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
