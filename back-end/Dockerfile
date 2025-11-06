# https://stackoverflow.com/questions/57534295/npm-err-tracker-idealtree-already-exists-while-creating-the-docker-image-for
FROM node:20.13-alpine
WORKDIR /usr/todo-app
ENV NODE_ENV=development
COPY ./ ./
RUN npm install
# Install curl for api healthchecks in docker-compose.yaml
RUN apk add --no-cache curl
CMD ["npm", "run", "start:dev"]
