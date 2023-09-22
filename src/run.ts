import { Context, Env } from "hono";
import path from "path";
import { getConfig } from "./page";
import { root } from "./utils";

export async function runFunction(
  context: Context<Env, string, {}>,
  params: Record<string, any>
) {
  const config = await getConfig();
  const name = context.req.path.replace(config.functionsPath, "") || "index";
  const fnPath = path.join(root, "functions", `${name}.ts`);
  const mod = await import(fnPath);

  const ini = Date.now();
  try {
    const result = await mod.default(context, params);

    return {
      ok: true,
      result,
      time: Date.now() - ini,
    };
  } catch (error: any) {
    return {
      ok: false,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      time: Date.now() - ini,
    };
  }
}
