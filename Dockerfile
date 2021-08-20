FROM node:14
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY ["*.js", "./"]

EXPOSE 3000

CMD ["node", "index.js"]
