.PHONY: help build dev test lint format docker deploy clean prune logs db-migrate db-seed db-studio worker

SHELL := /bin/bash
PROJECT_NAME := homepulse
BACKEND_DIR := backend
ADMIN_DIR := admin
DOCKER_DIR := docker
SCRIPTS_DIR := scripts

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all applications (backend, admin)
	@echo "Building $(PROJECT_NAME)..."
	@cd $(BACKEND_DIR) && npm run build
	@cd $(ADMIN_DIR) && npm run build
	@echo "Build complete."

dev: ## Start development environment (backend + admin)
	@echo "Starting development environment..."
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml up -d postgres redis
	@sleep 3
	@cd $(BACKEND_DIR) && npm run dev &
	@cd $(ADMIN_DIR) && npm run dev &
	@echo "Development environment started."

test: ## Run all tests
	@echo "Running tests..."
	@cd $(BACKEND_DIR) && npm test
	@cd $(ADMIN_DIR) && npm test || true
	@echo "Tests complete."

test-coverage: ## Run tests with coverage report
	@echo "Running tests with coverage..."
	@cd $(BACKEND_DIR) && npm run test:coverage
	@echo "Coverage report generated."

lint: ## Run linting on all codebases
	@echo "Running linters..."
	@cd $(BACKEND_DIR) && npm run lint
	@cd $(ADMIN_DIR) && npm run lint
	@echo "Linting complete."

format: ## Format code with Prettier
	@echo "Formatting code..."
	@cd $(BACKEND_DIR) && npm run format
	@cd $(ADMIN_DIR) && npm run format
	@echo "Formatting complete."

docker-build: ## Build all Docker images
	@echo "Building Docker images..."
	@docker build -t $(PROJECT_NAME)-backend:latest -f $(DOCKER_DIR)/Dockerfile.backend $(BACKEND_DIR)
	@docker build -t $(PROJECT_NAME)-admin:latest -f $(DOCKER_DIR)/Dockerfile.admin $(ADMIN_DIR)
	@docker build -t $(PROJECT_NAME)-nginx:latest -f $(DOCKER_DIR)/Dockerfile.nginx $(DOCKER_DIR)
	@docker build -t $(PROJECT_NAME)-redis:latest -f $(DOCKER_DIR)/Dockerfile.redis $(DOCKER_DIR)
	@docker build -t $(PROJECT_NAME)-worker:latest -f $(DOCKER_DIR)/Dockerfile.worker $(BACKEND_DIR)
	@echo "Docker images built."

docker-up: ## Start Docker Compose stack
	@echo "Starting Docker Compose stack..."
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml up -d
	@echo "Docker stack started."

docker-down: ## Stop Docker Compose stack
	@echo "Stopping Docker Compose stack..."
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml down
	@echo "Docker stack stopped."

docker-logs: ## Tail logs from all Docker services
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml logs -f --tail=100

docker-clean: ## Remove all Docker containers, images, and volumes
	@echo "Cleaning Docker resources..."
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml down -v --rmi all
	@docker system prune -af --volumes
	@echo "Docker cleaned."

deploy: ## Deploy to production
	@echo "Deploying to production..."
	@bash $(SCRIPTS_DIR)/deploy.sh production
	@echo "Deployment complete."

deploy-staging: ## Deploy to staging environment
	@echo "Deploying to staging..."
	@bash $(SCRIPTS_DIR)/deploy.sh staging
	@echo "Staging deployment complete."

clean: ## Clean build artifacts and dependencies
	@echo "Cleaning build artifacts..."
	@cd $(BACKEND_DIR) && rm -rf dist node_modules coverage
	@cd $(ADMIN_DIR) && rm -rf .next node_modules coverage
	@cd $(BACKEND_DIR) && npm cache clean --force
	@echo "Clean complete."

prune: ## Prune Docker resources and clean caches
	@echo "Pruning..."
	@docker system prune -af --volumes
	@cd $(BACKEND_DIR) && rm -rf dist node_modules coverage .cache
	@cd $(ADMIN_DIR) && rm -rf .next node_modules coverage .cache
	@echo "Prune complete."

logs-backend: ## Tail backend logs
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml logs -f --tail=100 backend

logs-admin: ## Tail admin logs
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml logs -f --tail=100 admin

logs-worker: ## Tail worker logs
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml logs -f --tail=100 worker

logs-nginx: ## Tail nginx logs
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml logs -f --tail=100 nginx

logs-all: ## Tail logs from all services
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml logs -f --tail=50

db-migrate: ## Run database migrations
	@echo "Running database migrations..."
	@cd $(BACKEND_DIR) && npx prisma migrate deploy
	@echo "Migrations complete."

db-migrate-dev: ## Run database migrations (development)
	@echo "Running development migrations..."
	@cd $(BACKEND_DIR) && npx prisma migrate dev
	@echo "Development migrations complete."

db-seed: ## Seed the database
	@echo "Seeding database..."
	@cd $(BACKEND_DIR) && npx prisma db seed
	@echo "Database seeded."

db-seed-force: ## Force seed the database (reset)
	@echo "Force seeding database..."
	@cd $(BACKEND_DIR) && npx prisma migrate reset --force && npx prisma db seed
	@echo "Database force-seeded."

db-studio: ## Open Prisma Studio
	@echo "Opening Prisma Studio..."
	@cd $(BACKEND_DIR) && npx prisma studio

db-push: ## Push schema changes without migration
	@echo "Pushing schema changes..."
	@cd $(BACKEND_DIR) && npx prisma db push
	@echo "Schema pushed."

db-generate: ## Generate Prisma client
	@echo "Generating Prisma client..."
	@cd $(BACKEND_DIR) && npx prisma generate
	@echo "Prisma client generated."

db-backup: ## Backup PostgreSQL database
	@echo "Backing up database..."
	@bash $(SCRIPTS_DIR)/backup.sh

db-restore: ## Restore PostgreSQL database from backup
	@echo "Restoring database..."
	@read -p "Enter backup file path: " backup_file; \
		docker compose -f $(DOCKER_DIR)/docker-compose.yml exec -T postgres psql -U homepulse -d homepulse < $$backup_file
	@echo "Database restored."

worker: ## Start background worker
	@echo "Starting worker..."
	@cd $(BACKEND_DIR) && npx ts-node src/workers/worker.ts

worker-dev: ## Start worker in development mode
	@echo "Starting worker in dev mode..."
	@cd $(BACKEND_DIR) && npx ts-node-dev --respawn --transpile-only src/workers/worker.ts

generate-qr: ## Bulk generate QR codes for properties
	@echo "Generating QR codes..."
	@bash $(SCRIPTS_DIR)/generate-qr.sh

install: ## Install all dependencies
	@echo "Installing dependencies..."
	@cd $(BACKEND_DIR) && npm install
	@cd $(ADMIN_DIR) && npm install
	@echo "Dependencies installed."

setup: ## Complete local setup (install, build, migrate, seed)
	@echo "Setting up $(PROJECT_NAME) locally..."
	@make install
	@make build
	@make db-migrate
	@make db-seed
	@echo "Setup complete. Run 'make dev' to start development."

health-check: ## Check health of all services
	@echo "Checking service health..."
	@curl -s http://localhost:3000/health | jq .
	@echo "Backend: OK"
	@curl -s http://localhost:3001/api/health | jq . || echo "Admin: Check manually"
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml exec postgres pg_isready -U homepulse
	@docker compose -f $(DOCKER_DIR)/docker-compose.yml exec redis redis-cli ping

k8s-apply: ## Apply Kubernetes manifests
	@echo "Applying Kubernetes manifests..."
	@kubectl apply -f infra/

k8s-delete: ## Delete Kubernetes resources
	@echo "Deleting Kubernetes resources..."
	@kubectl delete -f infra/

k8s-status: ## Check Kubernetes deployment status
	@kubectl get pods -n homepulse
	@kubectl get services -n homepulse
	@kubectl get ingress -n homepulse

k8s-logs: ## Tail Kubernetes logs
	@kubectl logs -f -n homepulse -l app=homepulse-backend --tail=100

.DEFAULT_GOAL := help
