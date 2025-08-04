# Use the official Node.js image
FROM public.ecr.aws/docker/library/node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Create production image
FROM public.ecr.aws/docker/library/node:22 AS runtime
WORKDIR /app

# Copy source files
COPY --from=builder /app ./

# Expose the port Next.js runs on. To run expose port from docker as -p 3001:3000 as example exposes port 3000 in the container to host port 3001
EXPOSE 3000

# Set NODE_ENV
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
