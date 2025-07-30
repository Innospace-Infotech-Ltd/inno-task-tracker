FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build the application
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY package*.json ./
CMD ["node", "dist/main.js"]

# Development image
FROM base AS dev
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]
