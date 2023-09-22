import { Server } from "bun";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import path from "path";
import { WATCH, devWebsocket } from "./dev.ts";
import { getConfig, guessPath, html, preload } from "./page.tsx";
import { runFunction } from "./run.ts";

const config = await getConfig();

let server: Server;
const app = new Hono();

if (WATCH) {
  app.get("/refresh", (c) => {
    server.upgrade(c.req.raw);

    return c.text("");
  });
}

app.all(path.join(config.functionsPath, "*"), async (c) => {
  const isGet = c.req.method === "GET";
  const params = isGet ? await c.req.query() : await c.req.parseBody();
  const result = await runFunction(c, params);

  return c.json(result);
});

app.get("*", async (c, next) => {
  if (!WATCH) {
    return serveStatic({ root: config.distDir })(c, next);
  }

  const file = await guessPath(c.req.path);

  if (!file) {
    return serveStatic({ root: config.distDir })(c, next);
  }

  return c.body(await html(file, c.req.path), {
    headers: {
      "Content-Type": "text/html",
    },
  });
});

app.notFound((c) => {
  return c.text("not found", 404);
});

app.onError((error, c) => {
  return c.json({
    ok: false,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  });
});

export async function start() {
  try {
    if (WATCH) {
      await preload().catch(console.error);
    }

    server = Bun.serve({
      fetch: app.fetch,
      websocket: devWebsocket,
      hostname: "0.0.0.0",
      port: config.port,
    });

    console.log(` 🚀 running @ http://127.0.0.1:${config.port}`);
  } catch (error) {
    console.error(error);
  }
}
