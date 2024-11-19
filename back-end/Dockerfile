# https://stackoverflow.com/questions/57534295/npm-err-tracker-idealtree-already-exists-while-creating-the-docker-image-for
FROM node:20.13-alpine
WORKDIR /usr/todo-app
COPY ./ ./
RUN npm install
CMD ["npm", "start"]