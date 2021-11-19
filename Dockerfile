FROM node:16.13.0

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "search-client.js", "./"]

RUN npm install --production

CMD [ "node", "search-client.js" ]