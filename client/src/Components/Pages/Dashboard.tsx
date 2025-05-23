import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Task {
  _id: string;
  name: string;
  category: string;
  due_date: string; // ISO format
  status: string;
}

// Helper to extract YYYY-MM-DD from ISO datetime
const extractDate = (iso: string) => iso.split('T')[0];

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchTasks(token);
  }, [navigate]);

  const fetchTasks = async (token: string) => {
    try {
      const res = await axios.get<Task[]>('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };

  // Filtered task groups
  const tasksDueToday = tasks.filter(
    (task) => extractDate(task.due_date) === today
  );
  const upcomingTasks = tasks.filter(
    (task) => extractDate(task.due_date) > today
  );
  const completedLast7Days = tasks.filter((task) => {
    const due = extractDate(task.due_date);
    return (
      task.status === 'completed' && due >= sevenDaysAgo && due <= today
    );
  });

  // Category Count Logic
  const categoryCounts: Record<string, number> = {};
  tasks.forEach((task) => {
    if (task.category) {
      categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
    }
  });
  const sortedCategories = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1]
  );

  // UI Component
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>

      {/* Dashboard Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardSection
          title="Tasks Due Today"
          items={tasksDueToday.map((t) => t.name)}
          emptyMessage="No tasks due today."
        />

        <DashboardSection
          title="Tasks Completed (Last 7 Days)"
          items={completedLast7Days.map((t) => `${t.name} — ${extractDate(t.due_date)}`)}
          emptyMessage="No tasks completed in the last 7 days."
        />

        <DashboardSection
          title="Upcoming Tasks"
          items={upcomingTasks.map((t) => `${t.name} — due ${extractDate(t.due_date)}`)}
          emptyMessage="No upcoming tasks."
        />

        <section className="bg-white p-4 rounded shadow md:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-2">Most Popular Task Categories</h2>
          {sortedCategories.length === 0 ? (
            <p className="text-gray-600">No categories yet.</p>
          ) : (
            <ul className="text-gray-800 list-disc pl-4">
              {sortedCategories.map(([category, count]) => (
                <li key={category}>
                  {category} – {count} task{count > 1 ? 's' : ''}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

// Reusable Section Component
function DashboardSection({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: string[];
  emptyMessage: string;
}) {
  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">{emptyMessage}</p>
      ) : (
        <ul className="text-gray-800 list-disc pl-4">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
