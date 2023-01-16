
# Build stage
FROM node:latest AS build
WORKDIR /usr/src/dingus
COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm install
RUN npm run build

# Run stage
FROM node:latest
WORKDIR /usr/src/dingus
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /usr/src/dingus/dist ./dist
EXPOSE 8080
CMD [ "node", "./dist/src/index.js" ]