FROM node:22-alpine

WORKDIR /app

# Copy root package.json and turbo.json
COPY tsconfig.base.json .
COPY package.json .
COPY package-lock.json .
COPY turbo.json .

# Copy the frontend package
COPY packages/frontend ./packages/frontend

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build --workspace=@nexus-gaming/frontend

# Expose the port
EXPOSE 5173

# Run the application
CMD ["npm", "run", "dev", "--workspace=@nexus-gaming/frontend"]
