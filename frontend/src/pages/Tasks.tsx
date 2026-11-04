import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { TaskCard } from '../components/TaskCard';
import { Button } from '../components/Button';
import { CreateModal, type FormField } from '../components/CreateModal';
import { taskService } from '../services/taskService';
import type { Task } from '../types/task';

const taskFields: FormField[] = [
  { name: 'title', label: 'Task name', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'dueDate', label: 'Date', type: 'date', required: true },
  { name: 'users', label: 'Users (comma separated)' },
];

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    taskService
      .getTasks()
      .then((data) => setTasks(Array.isArray(data) ? data : []))
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

  const handleCreateTask = async (data: Record<string, string>) => {
    try {
      const created = await taskService.createTask({
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        status: 'todo',
        users: data.users,
      });
      setTasks((prev) => [created, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  return (
    <div className="page">
      <div className="dashboard-header">
        <Header title="Tasks" />
        <Button text="Create Task" size="medium" onClick={() => setIsModalOpen(true)} />
      </div>
      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggleStatus={handleToggleStatus} />
        ))}
      </div>
      <CreateModal
        title="Create Task"
        fields={taskFields}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
