package repositories

import (
	"database/sql"
	"fmt"
	"time"

	"taskmanager/backend/internal/models"
)

// TaskRepository defines data access operations for tasks.
type TaskRepository struct {
	db *sql.DB
}

// NewTaskRepository creates a new TaskRepository.
func NewTaskRepository(db *sql.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

// GetAll returns all tasks ordered by creation date.
func (r *TaskRepository) GetAll() ([]models.Task, error) {
	rows, err := r.db.Query(`
		SELECT id, title, description, completed, created_at, updated_at
		FROM tasks
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("query tasks: %w", err)
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		if err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Completed, &task.CreatedAt, &task.UpdatedAt); err != nil {
			return nil, fmt.Errorf("scan task: %w", err)
		}
		tasks = append(tasks, task)
	}

	return tasks, rows.Err()
}

// GetByID returns a single task by its ID.
func (r *TaskRepository) GetByID(id int64) (models.Task, error) {
	var task models.Task
	err := r.db.QueryRow(`
		SELECT id, title, description, completed, created_at, updated_at
		FROM tasks
		WHERE id = ?
	`, id).Scan(&task.ID, &task.Title, &task.Description, &task.Completed, &task.CreatedAt, &task.UpdatedAt)
	if err != nil {
		return task, fmt.Errorf("get task by id: %w", err)
	}
	return task, nil
}

// Create inserts a new task and returns it with its generated ID.
func (r *TaskRepository) Create(task models.Task) (models.Task, error) {
	result, err := r.db.Exec(`
		INSERT INTO tasks (title, description, completed, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?)
	`, task.Title, task.Description, task.Completed, time.Now(), time.Now())
	if err != nil {
		return task, fmt.Errorf("insert task: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return task, fmt.Errorf("get last insert id: %w", err)
	}

	task.ID = id
	return task, nil
}

// Update modifies an existing task.
func (r *TaskRepository) Update(task models.Task) error {
	_, err := r.db.Exec(`
		UPDATE tasks
		SET title = ?, description = ?, completed = ?, updated_at = ?
		WHERE id = ?
	`, task.Title, task.Description, task.Completed, time.Now(), task.ID)
	if err != nil {
		return fmt.Errorf("update task: %w", err)
	}
	return nil
}

// Delete removes a task by its ID.
func (r *TaskRepository) Delete(id int64) error {
	_, err := r.db.Exec(`DELETE FROM tasks WHERE id = ?`, id)
	if err != nil {
		return fmt.Errorf("delete task: %w", err)
	}
	return nil
}
