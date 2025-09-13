.PHONY: install setup dev build prepack prepare clean lint check format publish publish-dry help

# Default target
help:
	@echo "Available targets:"
	@echo "  install   - Install dependencies"
	@echo "  setup     - Set up the project (install + prepare)"
	@echo "  dev       - Start development server"
	@echo "  build     - Build production version"
	@echo "  prepack   - Package the library for publishing"
	@echo "  prepare   - Run SvelteKit sync"
	@echo "  lint      - Run linting (Prettier + ESLint)"
	@echo "  check     - Run TypeScript checking"
	@echo "  format    - Format code with Prettier"
	@echo "  publish   - Publish package to npm"
	@echo "  publish-dry - Dry run publish (show what would be published)"
	@echo "  clean     - Clean build artifacts"

install:
	npm install

setup: install prepare
	@echo "Setup complete!"

dev:
	npm run dev

build:
	npm run build

prepack:
	npm run prepack

prepare:
	npm run prepare

lint:
	npm run lint

check:
	npm run check

format:
	npm run format

publish: build
	npm publish --tag rc

publish-dry: build
	npm publish --dry-run

clean:
	rm -rf dist node_modules/.vite
	@echo "Cleaned build artifacts"