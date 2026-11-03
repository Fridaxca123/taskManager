package services

import (
	"fmt"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"taskmanager/backend/internal/models"
	"taskmanager/backend/internal/repositories"
)

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService(repo *repositories.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// ListUsers returns all users.
func (s *UserService) ListUsers() ([]models.User, error) {
	return s.repo.GetAll()
}

// CreateUser validates and creates a user from a registration request.
func (s *UserService) CreateUser(req models.RegisterRequest) (models.User, error) {
	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(req.Email)
	req.Password = strings.TrimSpace(req.Password)

	if req.Name == "" {
		return models.User{}, fmt.Errorf("name is required")
	}

	if req.Email == "" {
		return models.User{}, fmt.Errorf("email is required")
	}

	if req.Password == "" {
		return models.User{}, fmt.Errorf("password is required")
	}

	if len(req.Password) < 6 {
		return models.User{}, fmt.Errorf("password must be at least 6 characters")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.User{}, fmt.Errorf("hash password: %w", err)
	}

	user := models.User{
		Name:         req.Name,
		Email:        req.Email,
		Role:         models.RoleUser,
		PasswordHash: string(hash),
	}

	return s.repo.Create(user)
}
