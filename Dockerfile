# Production Dockerfile for Automatiza Solução

FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM node:22-alpine AS runner

# Install netcat for healthchecks/entrypoint
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy build artifacts and necessary files
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

# Ensure entrypoint is executable
RUN chmod +x ./docker-entrypoint.sh

# Persistent storage directory
RUN mkdir -p /data/storage/logos /data/storage/previews /data/storage/uploads /data/storage/documents

EXPOSE 3000

# Entrypoint manages migrations and startup
ENTRYPOINT ["./docker-entrypoint.sh"]
