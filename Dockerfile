# Svelte FluentUI Workspace - Documentation Site Dockerfile
# Multi-stage build for optimized production image

# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy workspace root and package files. CHANGELOG.md is the source of truth
# for the docs homepage and /changelog route — they `import '../../../CHANGELOG.md?raw'`
# at build time, so the file must exist in the Docker context.
COPY package.json package-lock.json README.md CHANGELOG.md ./
COPY packages/svelte-fluentui/package.json ./packages/svelte-fluentui/
COPY docs/package.json ./docs/

# Install all workspace dependencies
RUN npm install

# Copy library source
COPY packages/svelte-fluentui/ ./packages/svelte-fluentui/

# Copy docs source
COPY docs/ ./docs/

# Build the library first (needed for docs)
WORKDIR /app/packages/svelte-fluentui
RUN npm run package

# Build the documentation site
WORKDIR /app/docs
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built documentation from builder stage
COPY --from=builder /app/docs/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
