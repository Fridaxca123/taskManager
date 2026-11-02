import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { TaskCard } from '../components/TaskCard';
import { taskService } from '../services/taskService';
import type { Task } from '../types/task';
import { Button } from '../components/Button';

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="page">
      <div className="dashboard-header">
        <Header title="Dashboard" />
        <Button text="Create User" size="medium" />
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
    </div>
  );
}
