### Builder stage: installs all deps and builds CSS
FROM node:20-slim AS builder

WORKDIR /app

# Copy manifest and install ALL deps (including dev) for building assets
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client and build Tailwind CSS
RUN npx prisma generate && npm run build:css

### Final stage: runtime image with only production deps
FROM node:20-slim AS runtime

WORKDIR /app

# Install runtime dependencies needed by Prisma and SQLite
RUN apt-get update && apt-get install -y --no-install-recommends \
		openssl \
		sqlite3 \
	&& rm -rf /var/lib/apt/lists/*

# Copy package manifests and install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source (respecting .dockerignore) and built CSS from builder
COPY . .
COPY --from=builder /app/public/style.css /app/public/style.css

# Generate Prisma client in runtime (safer if schema changes at runtime)
RUN npx prisma generate

EXPOSE 3000
# Default command runs the app; compose can override to run migrations first
CMD ["npm", "start"]
