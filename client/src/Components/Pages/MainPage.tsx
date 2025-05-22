import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
            TaskMaster
          </h1>
          <nav>
            <button
              onClick={() => navigate("/Login")}
              className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Login / Signup
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center px-6 text-center bg-gray-50">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 max-w-3xl leading-tight mb-6">
          Organize Your Tasks Effortlessly
        </h2>
        <p className="text-gray-700 max-w-xl mb-8 text-lg sm:text-xl">
          Stay on top of your deadlines and boost productivity with TaskMaster — the smart way to
          manage tasks and projects.
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white p-4 text-center">
        © {new Date().getFullYear()} TaskMaster. All rights reserved.
      </footer>
    </div>
  );
}
