FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install typescript
COPY . /app
RUN ./node_modules/typescript/bin/tsc  --init
RUN ./node_modules/typescript/bin/tsc 
COPY /dist /app
CMD node consumer.js
EXPOSE 6379