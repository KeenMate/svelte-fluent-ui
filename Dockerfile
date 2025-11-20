# Build stage
FROM node:22-alpine AS builder

# Build argument for version (latest for npm, file:.. for local source, or specific version like 1.0.0-rc03)
ARG VERSION=latest

WORKDIR /app

# Copy docs package files
COPY docs/package*.json ./docs/

WORKDIR /app/docs

# Conditional installation based on VERSION
# If VERSION is "file:..", install with local dependency (requires library source copied)
# Otherwise, install specific version from npm
RUN if [ "$VERSION" = "file:.." ]; then \
      echo "Installing with local svelte-fluentui (file:..)"; \
      npm install; \
    else \
      echo "Installing svelte-fluentui@$VERSION from npm"; \
      npm uninstall svelte-fluentui 2>/dev/null || true; \
      npm install svelte-fluentui@$VERSION; \
      npm install; \
    fi

# Copy docs source files
COPY docs/. ./

# Copy library source if building locally (VERSION=file:..)
# These copies will fail gracefully when building from npm (VERSION != file:..)
COPY src/ ../src/ 2>/dev/null || true
COPY scripts/ ../scripts/ 2>/dev/null || true
COPY svelte.config.js package.json ../ 2>/dev/null || true

# Build the documentation site
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder stage
COPY --from=builder /app/docs/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
