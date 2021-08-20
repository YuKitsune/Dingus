
# Build stage
FROM node:latest
WORKDIR /usr/src/necrobot
COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm install
RUN npm run build

# Run stage
FROM node:latest
WORKDIR /usr/src/necrobot
COPY package*.json ./
RUN npm ci --only=production
COPY ./dist/src ./dist/src
EXPOSE 8080
CMD [ "node", "./dist/src/index.js" ]