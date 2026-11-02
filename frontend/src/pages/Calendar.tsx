import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { taskService } from '../services/taskService';
import type { Task } from '../types/task';

export function Calendar() {
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

  const today = new Date().toISOString().split('T')[0];
  const upcomingTasks = tasks
    .filter((task) => task.dueDate && task.dueDate >= today)
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1));

  return (
    <div className="page">
      <Header title="Calendar" />
      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}
      <div className="calendar-grid">
        {upcomingTasks.map((task) => (
          <div key={task.id} className="calendar-event">
            <time dateTime={task.dueDate}>{task.dueDate}</time>
            <span>{task.title}</span>
          </div>
        ))}
        {upcomingTasks.length === 0 && !loading && <p>No upcoming tasks.</p>}
      </div>
    </div>
  );
}
