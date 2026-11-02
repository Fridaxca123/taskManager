import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggleStatus?: (id: string) => void;
}

export function TaskCard({ task, onToggleStatus }: TaskCardProps) {
  return (
    <div className={`task-card task-card--${task.status}`}>
      <div className="task-card__header">
        <h3>{task.title}</h3>
        {task.priority && (
          <span className={`task-card__priority task-card__priority--${task.priority}`}>
            {task.priority}
          </span>
        )}
      </div>
      {task.description && <p>{task.description}</p>}
      {task.dueDate && (
        <time dateTime={task.dueDate}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </time>
      )}
      {onToggleStatus && (
        <button
          type="button"
          onClick={() => onToggleStatus(task.id)}
          className="task-card__status"
        >
          {task.status}
        </button>
      )}
    </div>
  );
}
