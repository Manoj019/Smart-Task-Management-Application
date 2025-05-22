import { Bell, UserCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-800">Smart Task Manager</h1>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle className="w-8 h-8 text-gray-700" />
          <span className="hidden sm:block font-medium text-gray-700"></span>
        </div>
      </div>
    </header>
  );
}
