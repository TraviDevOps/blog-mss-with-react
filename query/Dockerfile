FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
COPY .env .

CMD ["npm", "start"]