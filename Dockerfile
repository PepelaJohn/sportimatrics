# Base image for building
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile --production
COPY . .
RUN npm run build

# Production-ready image
FROM builder AS production
WORKDIR /app

# Copy only necessary files from the builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/package-lock.json ./package-lock.json


EXPOSE 3000
CMD ["npm", "start"]
