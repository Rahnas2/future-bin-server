# 1. Base image
FROM node:20-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json & package-lock.json (for dependencies)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source files into the container
COPY . .

# 6. Expose port (replace with your app's port, typically 7070 for you)
EXPOSE 8080

# 7. Build (if you use TypeScript)
RUN npm run build

# 8. Start the app
CMD ["npm", "run", "start"]
