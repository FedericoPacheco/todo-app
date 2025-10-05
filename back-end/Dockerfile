# https://stackoverflow.com/questions/57534295/npm-err-tracker-idealtree-already-exists-while-creating-the-docker-image-for
FROM node:20.13-alpine
WORKDIR /usr/todo-app
ENV NODE_ENV=development

# Debug: Show what's in the build context
RUN echo "=== Build context before copy ===" && ls -la /usr/todo-app/

# Copy everything
COPY ./ ./

# Debug: Show what was copied
RUN echo "=== Files after copy ===" && ls -la /usr/todo-app/


#RUN npm install --only=dev
RUN npm install
CMD ["npm", "start"]
