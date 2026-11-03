package services

import (
	"fmt"

	"taskmanager/backend/internal/models"
	"taskmanager/backend/internal/repositories"
)

// TaskService contains business logic for tasks.
type TaskService struct {
	repo *repositories.TaskRepository
}

// NewTaskService creates a new TaskService.
func NewTaskService(repo *repositories.TaskRepository) *TaskService {
	return &TaskService{repo: repo}
}

// ListTasks returns all tasks.
func (s *TaskService) ListTasks() ([]models.Task, error) {
	return s.repo.GetAll()
}

// GetTask returns a task by ID.
func (s *TaskService) GetTask(id int64) (models.Task, error) {
	return s.repo.GetByID(id)
}

// CreateTask validates and creates a new task.
func (s *TaskService) CreateTask(task models.Task) (models.Task, error) {
	if task.Title == "" {
		return task, fmt.Errorf("title is required")
	}
	return s.repo.Create(task)
}

// UpdateTask validates and updates an existing task.
func (s *TaskService) UpdateTask(id int64, task models.Task) error {
	if id <= 0 {
		return fmt.Errorf("invalid task id")
	}
	if task.Title == "" {
		return fmt.Errorf("title is required")
	}

	task.ID = id
	return s.repo.Update(task)
}

// DeleteTask removes a task.
func (s *TaskService) DeleteTask(id int64) error {
	if id <= 0 {
		return fmt.Errorf("invalid task id")
	}
	return s.repo.Delete(id)
}
