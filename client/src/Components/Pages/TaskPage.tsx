import  { useEffect, useState } from 'react';
import axios from 'axios';

import type { Task } from '../../types/task'; // ensure this is a module exporting Task type

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get<Task[]>('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

 

  return (
    <div className="p-4">
      
      <h2 className="text-xl font-bold mt-6">My Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task._id} className="p-4 bg-white shadow rounded">
            <strong>{task.name}</strong> - {task.status} -   {task.due_date}
          </li>
        ))}
      </ul>
    </div>
  );
}
