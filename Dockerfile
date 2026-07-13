FROM node:22-slim

WORKDIR /app

# Install deps first so this layer is cached unless package files change.
# better-sqlite3 is a native module — it must be installed on Linux, inside the image.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY public ./public

ENV PORT=3000
ENV DB_FILE=/data/characters.db

EXPOSE 3000

CMD ["node", "src/server.js"]
