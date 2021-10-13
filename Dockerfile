FROM node:14
# Create app directory
WORKDIR /app
COPY package*.json ./
COPY package*.json ./
COPY . .
RUN npm install
RUN npm install -g nodemon
# Bundle app source
COPY . .
EXPOSE 9099
CMD [ "node", "server.js" ]