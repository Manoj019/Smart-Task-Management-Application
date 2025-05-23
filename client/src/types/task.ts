// ✅ This defines and exports the Task interface
export interface Task {
  id: string;
  name: string;
  description: string;
  category: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
}
