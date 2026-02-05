# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY vue-app/package*.json ./
RUN npm install
COPY vue-app/ .
RUN npm run build

# Stage 2: Setup Backend and Final Image
FROM node:18-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend code
COPY backend/ .

# Copy built frontend assets
COPY --from=frontend-builder /app/dist ./dist

# Create data directories
RUN mkdir -p data public/uploads

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
