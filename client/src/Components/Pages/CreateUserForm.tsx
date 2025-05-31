import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CreateUserFormProps {
  onSubmit: (formData: { name: string; email: string; password: string; role: string }) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/createuser`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Created user:', res.data.user);
      toast.success('User created successfully!');
      onSubmit(formData); // Notify parent
      setFormData({ name: '', email: '', password: '', role: 'user' });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Failed to create user');
      } else {
        toast.error('Failed to create user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
      <ToastContainer position="top-center" autoClose={2000} />

      <h2 className="text-xl font-semibold">Create New User</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="User Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
