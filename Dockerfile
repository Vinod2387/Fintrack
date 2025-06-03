# Use official Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and lock file first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

# Expose port (same as in .env)
EXPOSE 9002

# Start the app
CMD ["npm", "start"]