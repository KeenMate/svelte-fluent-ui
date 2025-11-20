# Build stage
FROM node:22-alpine AS builder

# Build argument for version (file:.. for local source, or specific version like 1.0.0-rc04)
ARG VERSION=1.0.0-rc04

WORKDIR /app

# Copy library source files to /app (needed for VERSION=file:..)
# When building from npm (VERSION != file:..), these are copied but not used
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY svelte.config.js package.json ./

# Copy docs folder
COPY docs/ ./docs/

# Switch to docs directory for build
WORKDIR /app/docs

# Conditional installation based on VERSION
# If VERSION is "file:..", use local source from ../
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
