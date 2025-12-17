FROM node:20-slim

WORKDIR /app

# Install openssl/sqlite dependencies
RUN apt-get update && apt-get install -y openssl sqlite3 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --production=false

COPY . .

RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "start"]
