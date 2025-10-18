# Use Node.js LTS version
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies first
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
