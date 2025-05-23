import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';

interface Task {
  _id: string;
  name: string;
  category: string;
  due_date: string;
  status: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    } else {
      fetchTasks(token);
    }
  }, [navigate]);

  const fetchTasks = async (token: string) => {
    try {
      const res = await axios.get<Task[]>('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  // === Analytics Data ===

  // 1. Tasks per Category
  const categoryData = Object.entries(
    tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count }));

  // 2. Task Status Pie Chart
  const statusData = Object.entries(
    tasks.reduce((acc: Record<string, number>, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ name: status, value: count }));

  // 3. Tasks Completed Last 7 Days (Line Chart)
  const today = new Date();
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    const key = date.toISOString().split('T')[0];
    return {
      date: key,
      count: tasks.filter(
        (t) =>
          t.status === 'completed' &&
          t.due_date.startsWith(key)
      ).length,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <p className="text-gray-600">Insights based on your tasks</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart: Tasks per Category */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Tasks per Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Pie Chart: Task Status */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Task Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>

        {/* Line Chart: Completed Tasks in 7 Days */}
        <section className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Tasks Completed in Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7Days}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
}
