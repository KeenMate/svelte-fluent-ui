# Svelte FluentUI Workspace - Makefile
# Development and build commands for the FluentUI wrapper library (workspace version)

# === Configuration ===
# Use cmd.exe on Windows to avoid path mangling issues with npm
ifeq ($(OS),Windows_NT)
SHELL := cmd.exe
.SHELLFLAGS := /c
endif

# Dev server port (docs vite dev). Override: make kill-port PORT=3000
PORT ?= 12900

# Docker image settings
DOCKER_IMAGE_NAME = registry.km8.es/svelte-fluentui-showcase
DOCKER_TAG = production
DOCKER_CONTAINER_NAME = svelte-fluentui-docs
DOCKER_PORT = 8080

.PHONY: setup dev build package create-link unlink publish publish-rc publish-dry clean help kill-port
.PHONY: docker-build-docs docker-run-docs docker-stop-docs docker-clean-docs
.PHONY: test-e2e test-e2e-ui test-e2e-headed test-e2e-install

# Default target
help:
	@echo Svelte FluentUI Workspace - Available Commands:
	@echo
	@echo Development:
	@echo   setup        - Install dependencies for all workspace packages
	@echo   dev          - Start development server (docs with HMR)
	@echo   build        - Build production version (library + docs)
	@echo   package      - Package the library for publishing
	@echo   create-link  - Create global npm link for svelte-fluentui
	@echo   unlink       - Remove global npm link for svelte-fluentui
	@echo   kill-port    - Free the dev server port (default $(PORT); override with PORT=xxxx)
	@echo
	@echo Publishing:
	@echo   publish              - Publish to npm under 'latest' dist-tag
	@echo   publish TAG=rc       - Publish under a specific dist-tag (e.g. 'rc' for prereleases)
	@echo   publish-rc           - Publish under the 'rc' dist-tag (shortcut for publish TAG=rc)
	@echo   publish-dry          - Dry run publish (show what would be published)
	@echo
	@echo End-to-end tests (Playwright):
	@echo   test-e2e-install - One-time: download chromium browser binary
	@echo   test-e2e         - Run e2e suite headless
	@echo   test-e2e-ui      - Open Playwright Test UI (debugging)
	@echo   test-e2e-headed  - Run with a visible browser window
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

# Free the dev server port. Kills whatever is LISTENING on $(PORT) — covers
# both IPv4 and IPv6 (vite binds [::1]:$(PORT), which a naive IPv4-only check
# misses). Override the port with: make kill-port PORT=3000
kill-port:
	@echo Freeing port $(PORT)...
ifeq ($(OS),Windows_NT)
	-@for /f "tokens=5" %%a in ('netstat -ano ^| findstr :$(PORT) ^| findstr LISTENING') do taskkill /F /PID %%a
else
	-@lsof -ti tcp:$(PORT) | xargs -r kill -9
endif
	@echo Port $(PORT) is free

build:
	@echo Building library and documentation...
	npm run build

package:
	@echo
	@echo Cleaning previous dist folder...
	cd packages/svelte-fluentui && node -e "const fs=require('fs');if(fs.existsSync('dist'))fs.rmSync('dist',{recursive:true,force:true})"
	@echo Building library package...
	cd packages/svelte-fluentui && npm run package
	@echo
	@echo Package built successfully
	@echo

create-link: package
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
	@echo Publishing to npm$(if $(TAG), under '$(TAG)' dist-tag, under default 'latest' dist-tag)...
	@echo
	cd packages/svelte-fluentui && npm publish$(if $(TAG), --tag $(TAG))
	@echo
	@echo Published successfully!

# Convenience shortcut for prereleases: publishes under the 'rc' dist-tag so it
# never moves the 'latest' tag. Equivalent to: make publish TAG=rc
publish-rc:
	@$(MAKE) publish TAG=rc

publish-dry: package
	@echo Dry run - showing what would be published...
	cd packages/svelte-fluentui && npm publish --dry-run

test-e2e-install:
	@echo Installing chromium for Playwright...
	npm run test:e2e:install

test-e2e:
	@echo Running e2e tests (headless)...
	npm run test:e2e

test-e2e-ui:
	@echo Opening Playwright Test UI...
	npm run test:e2e:ui

test-e2e-headed:
	@echo Running e2e tests in headed mode...
	npm run test:e2e:headed

clean:
	@echo Cleaning build artifacts...
ifeq ($(OS),Windows_NT)
	-rd /s /q packages\svelte-fluentui\dist 2>nul
	-rd /s /q packages\svelte-fluentui\node_modules\.vite 2>nul
	-rd /s /q docs\.svelte-kit 2>nul
	-rd /s /q docs\build 2>nul
else
	rm -rf packages/svelte-fluentui/dist packages/svelte-fluentui/node_modules/.vite
	rm -rf docs/.svelte-kit docs/build
endif
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
