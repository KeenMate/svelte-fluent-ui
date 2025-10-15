# Svelte FluentUI - Makefile
# Development and build commands for the FluentUI wrapper library

# === Configuration ===
# Force bash shell for Windows compatibility
SHELL := /bin/bash

# Docker image settings
DOCKER_IMAGE_NAME = registry.km8.es/svelte-fluentui-showcase
DOCKER_TAG = production
DOCKER_CONTAINER_NAME = svelte-fluentui-showcase
DOCKER_PORT = 8080

.PHONY: install setup dev build package clean lint check format publish publish-dry help
.PHONY: docker-build docker-run docker-stop docker-start docker-restart docker-logs docker-clean docker-deploy

# Default target
help:
	@echo "Svelte FluentUI - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  install      - Install dependencies"
	@echo "  setup        - Set up the project (install)"
	@echo "  dev          - Start development server"
	@echo "  build        - Build production version (demo site + package)"
	@echo "  package      - Package the library for publishing"
	@echo ""
	@echo "Quality:"
	@echo "  lint         - Run linting (Prettier + ESLint)"
	@echo "  check        - Run TypeScript checking"
	@echo "  format       - Format code with Prettier"
	@echo ""
	@echo "Publishing:"
	@echo "  publish      - Publish package to npm"
	@echo "  publish-dry  - Dry run publish (show what would be published)"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build   - Build Docker image"
	@echo "  docker-run     - Run Docker container (creates new)"
	@echo "  docker-start   - Start existing Docker container"
	@echo "  docker-stop    - Stop Docker container"
	@echo "  docker-restart - Restart Docker container"
	@echo "  docker-logs    - Show Docker container logs"
	@echo "  docker-clean   - Remove Docker container and image"
	@echo "  docker-deploy  - Build and run Docker container"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean        - Clean build artifacts"

install:
	npm install

setup: install
	@echo "Setup complete!"

dev:
	npm run dev

build:
	npm run build

package:
	npm run package

lint:
	npm run lint

check:
	npm run check

format:
	npm run format

publish: package
	npm publish --tag rc

publish-dry: package
	npm publish --dry-run

clean:
	rm -rf dist node_modules/.vite
	@echo "Cleaned build artifacts"

# Docker commands
docker-build: ## Build Docker image
	@echo "Building Docker image: $(DOCKER_IMAGE_NAME):$(DOCKER_TAG)"
	docker build -t $(DOCKER_IMAGE_NAME):$(DOCKER_TAG) .
	@echo "Docker image built successfully!"

docker-run: ## Run Docker container
	@echo "Starting Docker container on port $(DOCKER_PORT)"
	docker run -d --name $(DOCKER_CONTAINER_NAME) -p $(DOCKER_PORT):80 $(DOCKER_IMAGE_NAME):$(DOCKER_TAG)
	@echo "Application is running at: http://localhost:$(DOCKER_PORT)"

docker-stop: ## Stop Docker container
	@echo "Stopping Docker container"
	docker stop $(DOCKER_CONTAINER_NAME)
	@echo "Container stopped successfully"

docker-restart: docker-stop docker-start ## Restart Docker container

docker-start: ## Start existing Docker container
	@echo "Starting existing Docker container"
	docker start $(DOCKER_CONTAINER_NAME)
	@echo "Application is running at: http://localhost:$(DOCKER_PORT)"

docker-logs: ## Show Docker container logs
	docker logs -f $(DOCKER_CONTAINER_NAME)

docker-clean: docker-stop ## Remove Docker container and image
	@echo "Cleaning up Docker resources"
	docker rm $(DOCKER_CONTAINER_NAME)
	docker rmi $(DOCKER_IMAGE_NAME):$(DOCKER_TAG)
	@echo "Cleanup complete"

docker-deploy: docker-build docker-run ## Build and run Docker container