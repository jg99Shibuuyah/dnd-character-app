FROM node:26-slim

WORKDIR /app

# --- Build the React client (its own dependency set) ---
# Done first, in a cacheable layer, so server changes don't rebuild the client.
COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client
COPY client ./client
# The client imports builtin game data from ../public/resources at build time.
COPY public ./public
RUN npm run build --prefix client

# --- Server dependencies ---
# better-sqlite3 is a native module — installed on Linux, inside the image.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV PORT=3000
ENV DB_FILE=/data/characters.db

EXPOSE 3000

CMD ["node", "src/server.js"]
