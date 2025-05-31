import { useState, useEffect, useId, useTransition } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify'; // ✅ Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // ✅ Import Toast styles

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const emailId = useId();
  const passwordId = useId();

  useEffect(() => {
    console.log('Login component mounted');
    return () => {
      console.log('Login component unmounted');
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error('All fields are required');
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return toast.error('Invalid email format');
    }

    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);

    startTransition(async () => {
      try {
        const res = await axios.post('http://localhost:5001/api/auth/login', form);
        localStorage.setItem('token', res.data.token);
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/Dashboard');
        }, 1500); // Wait for toast to show before navigating
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data?.message || 'Login failed');
        } else {
          toast.error('Login failed');
        }
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Toast container must be added once in your app */}
      <ToastContainer position="top-center" autoClose={2000} />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <label htmlFor={emailId} className="sr-only">Email</label>
        <input
          id={emailId}
          name="email"
          value={form.email}
          placeholder="Email"
          type="email"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative">
          <label htmlFor={passwordId} className="sr-only">Password</label>
          <input
            id={passwordId}
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
          disabled={loading || isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading || isPending ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-gray-600">
          Don't have an account?
          <Link to="/signup" className="text-blue-600 hover:underline"> SignUp</Link>
        </p>
      </form>
    </div>
  );
}
