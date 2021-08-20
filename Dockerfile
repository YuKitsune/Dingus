FROM node:16-alpine
WORKDIR /usr/src/necrobot

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm ci --only=production
COPY ./src/ .
EXPOSE 8080
CMD [ "node", "index.ts" ]