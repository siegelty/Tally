FROM reidweb1/node-typescript:1.0.0

WORKDIR /app

ADD . /app

ENV PORT 3001

EXPOSE 3001

COPY package.json package.json
RUN npm install && tsc

COPY . .
RUN npm run build

CMD ["node", "dist/"]