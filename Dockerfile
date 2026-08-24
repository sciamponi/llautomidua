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

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy build artifacts and necessary files
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Persistent storage directory
RUN mkdir -p /data/storage/logos /data/storage/previews /data/storage/uploads /data/storage/documents

EXPOSE 3000

# Start command (TanStack Start / Nitro output)
CMD ["node", ".output/server/index.mjs"]
