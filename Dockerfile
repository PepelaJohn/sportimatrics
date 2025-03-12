# Build stage
FROM node:22-alpine AS build

WORKDIR /src

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile --production

# Copy the rest of the project
COPY . . 

# Build the project
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /src

# Copy only required files
COPY --from=build /src/.next ./.next
COPY --from=build /src/package.json ./package.json
COPY --from=build /src/public ./public

# Install only production dependencies
RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]

