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

# Copy only necessary files from build stage
COPY --from=build /src/.next ./.next
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/package.json ./package.json
COPY --from=build /src/public ./public

EXPOSE 3000
CMD ["npm", "start"]
