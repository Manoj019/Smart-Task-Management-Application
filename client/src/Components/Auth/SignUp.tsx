import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify'; // ✅ Toastify
import 'react-toastify/dist/ReactToastify.css'; // ✅ Styles

interface SignupForm {
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const [form, setForm] = useState<SignupForm>({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error('All fields are required');
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return toast.error('Invalid email format');
    }

    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      toast.success('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Delay to allow toast to show
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Signup failed');
      } else {
        toast.error('Signup failed');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* ✅ Toast container (place once in your app layout ideally) */}
      <ToastContainer position="top-center" autoClose={2000} />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Signup</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
