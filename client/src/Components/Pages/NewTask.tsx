import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TaskForm {
  name: string;
  description: string;
  category: string;
  due_date: string;
  status: string;
}

interface NewTaskProps {
  onTaskCreated?: () => void;
}

export default function NewTask({ onTaskCreated }: NewTaskProps) {
  const [form, setForm] = useState<TaskForm>({
    name: '',
    description: '',
    category: '',
    due_date: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/tasks', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Task created successfully!');
      setForm({ name: '', description: '', category: '', due_date: '', status: '' });

      setTimeout(() => {
        if (onTaskCreated) {
          onTaskCreated();
        } else {
          navigate('/tasks');
        }
      }, 1500); // short delay for the toast to show
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-full flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
      {/* ✅ Toast container (should ideally be in root App) */}
      <ToastContainer position="top-center" autoClose={2000} />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4 overflow-auto max-h-[90vh]"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">Create New Task</h2>

        <input
          name="name"
          placeholder="Task Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows={4}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          name="due_date"
          type="date"
          value={form.due_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          required
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}
