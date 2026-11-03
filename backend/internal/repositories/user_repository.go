package repositories

import (
	"database/sql"
	"fmt"

	"taskmanager/backend/internal/models"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// GetAll returns all users.
func (r *UserRepository) GetAll() ([]models.User, error) {
	rows, err := r.db.Query(`
		SELECT id, name, email, role, created_at
		FROM users
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, fmt.Errorf("query users: %w", err)
	}
	defer rows.Close()

	var users []models.User

	for rows.Next() {
		var user models.User

		if err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.Email,
			&user.Role,
			&user.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan user: %w", err)
		}

		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate users: %w", err)
	}

	return users, nil
}

// Create inserts a new user and returns it with its generated ID.
func (r *UserRepository) Create(user models.User) (models.User, error) {
	result, err := r.db.Exec(`
		INSERT INTO users (name, email, role, password_hash)
		VALUES (?, ?, ?, ?)
	`, user.Name, user.Email, user.Role, user.PasswordHash)

	if err != nil {
		return user, fmt.Errorf("insert user: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return user, fmt.Errorf("get last insert id: %w", err)
	}

	user.ID = id

	err = r.db.QueryRow(`
		SELECT created_at FROM users WHERE id = ?
	`, id).Scan(&user.CreatedAt)

	if err != nil {
		return user, fmt.Errorf("get created_at: %w", err)
	}

	return user, nil
}
