import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { TaskCard } from '../components/TaskCard';
import { Button } from '../components/Button';
import { CreateModal, type FormField } from '../components/CreateModal';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';
import type { Task } from '../types/task';

const userFields: FormField[] = [
  { name: 'name', label: 'Name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'role', label: 'Role' },
];

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    taskService
      .getTasks()
      .then(setTasks)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false));
  }, []);

  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  const handleCreateUser = async (data: Record<string, string>) => {
    try {
      await userService.createUser({
        name: data.name,
        email: data.email,
        role: data.role,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  return (
    <div className="page">
      <div className="dashboard-header">
        <Header title="Dashboard" />
        <Button text="Create User" size="medium" onClick={() => setIsModalOpen(true)} />
      </div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-card__value">{todoCount}</span>
          <span className="stat-card__label">To Do</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{inProgressCount}</span>
          <span className="stat-card__label">In Progress</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{doneCount}</span>
          <span className="stat-card__label">Done</span>
        </div>
      </div>
      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}
      <div className="task-list">
        {tasks.slice(0, 5).map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <CreateModal
        title="Create User"
        fields={userFields}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}
