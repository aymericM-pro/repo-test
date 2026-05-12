FROM node:20-alpine

RUN npm install -g pnpm ts-node-dev

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
