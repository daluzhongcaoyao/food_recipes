# Final Image - Backend + Pre-built Frontend
FROM node:18-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy backend code
COPY backend/ .

# Copy locally built frontend assets (build on local machine first: cd vue-app && npm run build)
COPY vue-app/dist ./dist

# Create data directories
RUN mkdir -p data public/uploads

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
