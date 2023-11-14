FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY ./ ./

RUN bun install
RUN bun run build

CMD ["bun", "run", "start"]
