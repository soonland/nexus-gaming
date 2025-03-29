FROM node:22-alpine

# Install OpenSSL and other required dependencies
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy root package.json and turbo.json
COPY package.json .
COPY package-lock.json .
COPY turbo.json .

# Copy the backend package
COPY packages/backend ./packages/backend

# Install dependencies
RUN npm ci
RUN cd packages/backend && npx prisma generate

# Build the application
RUN npm run build --workspace=@nexus-gaming/backend

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev", "--workspace=@nexus-gaming/backend"]
