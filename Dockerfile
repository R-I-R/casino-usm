# Development Dockerfile for Next.js + pnpm
# Use Node.js 22 LTS on Debian slim
FROM node:22-bookworm-slim

# Avoid interactive prompts and disable telemetry in containers
ENV DEBIAN_FRONTEND=noninteractive \
    NEXT_TELEMETRY_DISABLED=1

# Enable pnpm via Corepack
RUN corepack enable

# Create app directory
WORKDIR /app

# Install dependencies first (better build cache)
COPY package.json pnpm-lock.yaml ./
# In development, allow lockfile updates to avoid build failures when package.json changes
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the source code
COPY . .

# Expose Next.js dev port
EXPOSE 3000

# Default: start Next.js dev server
CMD ["pnpm", "dev", "-p", "3000", "--hostname", "0.0.0.0"]
