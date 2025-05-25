import React, { useState } from 'react';
import axios from 'axios';

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


  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  try {
    const res = await axios.post(`${BASE_URL}/api/auth/createuser`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });console.log('Created user:', res.data.user);
    alert('User created successfully');
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.message || 'Failed to create user');
    } else {
      alert('Failed to create user');
    }
  }

  onSubmit(formData);
};


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
      <h2 className="text-xl font-semibold">Create New User</h2>
      <input
        type="text"
        name="name"
        placeholder="User Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
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
      >
        Create User
      </button>
    </form>
  );
};

export default CreateUserForm;
