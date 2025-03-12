
FROM node:22-alpine AS base
WORKDIR /src
COPY package*.json .
RUN npm install 
COPY . . 
RUN npm run build



FROM base AS production
WORKDIR /src
# Copy only required files
COPY --from=base /src/.next ./.next
COPY --from=base /src/node_modules ./node_nodules
COPY --from=base /src/package.json ./package.json
COPY --from=base /src/public ./public
COPY --from=base /src/package-lock.json ./package-lock.json



EXPOSE 3000
CMD ["npm", "start"]