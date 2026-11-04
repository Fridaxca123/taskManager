package routes

import (
	"database/sql"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"taskmanager/backend/internal/handlers"
	"taskmanager/backend/internal/repositories"
	"taskmanager/backend/internal/services"
)

// NewRouter sets up the application routes and returns a configured gin engine.
func NewRouter(db *sql.DB) *gin.Engine {
	router := gin.Default()
	router.Use(cors.Default())

	taskRepo := repositories.NewTaskRepository(db)
	taskService := services.NewTaskService(taskRepo)
	taskHandler := handlers.NewTaskHandler(taskService)
	healthHandler := handlers.NewHealthHandler()

	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userHandler := handlers.NewUserHandler(userService)

	router.GET("/health", healthHandler.Health)

	router.GET("/users", userHandler.GetUsers)
	router.POST("/users", userHandler.CreateUser)

	tasks := router.Group("/tasks")
	{
		tasks.GET("", taskHandler.GetTasks)
		tasks.GET("/:id", taskHandler.GetTask)
		tasks.POST("", taskHandler.CreateTask)
		tasks.PUT("/:id", taskHandler.UpdateTask)
		tasks.DELETE("/:id", taskHandler.DeleteTask)
	}

	return router
}
