# Svelte FluentUI Workspace - Makefile
# Development and build commands for the FluentUI wrapper library (workspace version)

# === Configuration ===
# Force bash shell for Windows compatibility
SHELL := /bin/bash

# Docker image settings
DOCKER_IMAGE_NAME = registry.km8.es/svelte-fluentui-showcase
DOCKER_TAG = production
DOCKER_CONTAINER_NAME = svelte-fluentui-docs
DOCKER_PORT = 8080

.PHONY: setup dev build package link unlink publish publish-dry clean help
.PHONY: docker-build-docs docker-run-docs docker-stop-docs docker-clean-docs

# Default target
help:
	@echo Svelte FluentUI Workspace - Available Commands:
	@echo
	@echo Development:
	@echo   setup        - Install dependencies for all workspace packages
	@echo   dev          - Start development server (docs with HMR)
	@echo   build        - Build production version (library + docs)
	@echo   package      - Package the library for publishing
	@echo   link         - Create global npm link for svelte-fluentui
	@echo   unlink       - Remove global npm link for svelte-fluentui
	@echo
	@echo Publishing:
	@echo   publish      - Publish package to npm (asks for confirmation)
	@echo   publish-dry  - Dry run publish (show what would be published)
	@echo
	@echo Docker (Documentation Site):
	@echo   docker-build-docs - Build docs Docker image (--no-cache --progress plain)
	@echo   docker-run-docs   - Run docs container on port $(DOCKER_PORT)
	@echo   docker-stop-docs  - Stop docs container
	@echo   docker-clean-docs - Stop and remove docs container and image
	@echo
	@echo Cleanup:
	@echo   clean        - Clean build artifacts

setup:
	@echo Installing workspace dependencies...
	npm install
	@echo
	@echo Setup complete!

dev:
	@echo Starting development server with HMR...
	npm run dev

build:
	@echo Building library and documentation...
	npm run build

package:
	@echo
	@echo Building library package...
	cd packages/svelte-fluentui && npm run package
	@echo
	@echo Package built successfully
	@printf "  Files: %s\n" "$$(find packages/svelte-fluentui/dist -type f | wc -l)"
	@printf "  Size: %s\n" "$$(du -sh packages/svelte-fluentui/dist | cut -f1)"
	@echo

link: package
	@echo
	@echo Creating global npm link for svelte-fluentui...
	cd packages/svelte-fluentui && npm link
	@echo
	@echo Link created successfully!
	@echo To use in your project, run: npm link svelte-fluentui
	@echo

unlink:
	@echo
	@echo Removing global npm link for svelte-fluentui...
	cd packages/svelte-fluentui && npm unlink
	@echo
	@echo Link removed successfully!
	@echo

publish: package
	@echo
	@echo WARNING: You are about to publish to npm!
	@echo
	@read -p "Are you sure you want to publish? (yes/no): " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		echo Publishing to npm...; \
		cd packages/svelte-fluentui && npm publish --tag rc; \
		echo Published successfully!; \
	else \
		echo Publish cancelled.; \
		exit 1; \
	fi

publish-dry: package
	@echo Dry run - showing what would be published...
	cd packages/svelte-fluentui && npm publish --dry-run

clean:
	@echo Cleaning build artifacts...
	rm -rf packages/svelte-fluentui/dist packages/svelte-fluentui/node_modules/.vite
	rm -rf docs/.svelte-kit docs/build
	@echo Cleaned build artifacts

# Docker commands for documentation site
docker-build-docs:
	@echo Building documentation Docker image...
	@echo   - Using --no-cache for fresh build
	@echo   - Using --progress plain for detailed output
	@echo
	docker build --no-cache --progress plain \
		-t $(DOCKER_IMAGE_NAME):$(DOCKER_TAG) \
		-t $(DOCKER_IMAGE_NAME):latest \
		.
	@echo
	@echo Documentation Docker image built successfully!

docker-run-docs:
	@echo Starting documentation container on http://localhost:$(DOCKER_PORT)...
	docker run -d --name $(DOCKER_CONTAINER_NAME) \
		-p $(DOCKER_PORT):80 \
		$(DOCKER_IMAGE_NAME):$(DOCKER_TAG)
	@echo
	@echo Documentation running at http://localhost:$(DOCKER_PORT)
	@echo    To stop: make docker-stop-docs

docker-stop-docs:
	@echo Stopping documentation container...
	-docker stop $(DOCKER_CONTAINER_NAME)
	-docker rm $(DOCKER_CONTAINER_NAME)
	@echo Documentation container stopped and removed

docker-clean-docs: docker-stop-docs
	@echo Removing Docker image...
	-docker rmi $(DOCKER_IMAGE_NAME):$(DOCKER_TAG)
	-docker rmi $(DOCKER_IMAGE_NAME):latest
	@echo Docker cleanup complete
