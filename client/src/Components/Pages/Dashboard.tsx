import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  // Redirect to login if no token found
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };

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

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Tasks Due Today */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Tasks Due Today</h2>
          <p className="text-gray-600">No tasks due today. (Add tasks to see them here)</p>
        </section>

        {/* Tasks Completed (Last 7 Days) */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Tasks Completed (Last 7 Days)</h2>
          {/* Placeholder for graph */}
          <div className="h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500">
            Graph Placeholder
          </div>
        </section>

        {/* Upcoming Tasks */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Upcoming Tasks</h2>
          <p className="text-gray-600">No upcoming tasks. (Add tasks to see them here)</p>
        </section>

        {/* Most Popular Task Categories */}
        <section className="bg-white p-4 rounded shadow md:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-2">Most Popular Task Categories</h2>
          <p className="text-gray-600">No categories yet. (Add tasks with categories)</p>
        </section>
      </div>
    </div>
  );
}
