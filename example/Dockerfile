FROM oven/bun

EXPOSE 3000

WORKDIR /app

COPY . .

RUN bun install

RUN bun preload

CMD bun start