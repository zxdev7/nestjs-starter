FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json files for workspace
COPY package.json yarn.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/*/

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build NestJS application
RUN yarn build:api

# Use a smaller image for production
FROM node:20-alpine AS production

# Create app directory
WORKDIR /app

# Copy package.json files
COPY package.json yarn.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/*/

# Install production dependencies only
RUN yarn install --frozen-lockfile --production

# Copy build from previous stage
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/generated ./apps/api/generated
COPY --from=base /app/apps/api/prisma ./apps/api/prisma
COPY .env* ./

# Expose the port
EXPOSE 5000

# Command to run the application
CMD ["node", "apps/api/dist/main.js"]
