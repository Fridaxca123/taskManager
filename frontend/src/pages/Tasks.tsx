import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { TaskCard } from '../components/TaskCard';
import { taskService } from '../services/taskService';
import type { Task } from '../types/task';

export function Tasks() {
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

  const handleToggleStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      const updated = await taskService.updateTask(id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  return (
    <div className="page">
      <Header title="Tasks" />
      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggleStatus={handleToggleStatus} />
        ))}
      </div>
    </div>
  );
}
