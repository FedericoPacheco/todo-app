# FROM node:20.13-alpine
# WORKDIR /usr/todo-app
# COPY ./ ./
# RUN npm install
# EXPOSE 3000
# CMD ["npm", "start"]

# Dockerfile
FROM node:20.13-alpine
WORKDIR /usr/todo-app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]