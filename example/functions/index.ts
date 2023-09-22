import type { Context, Env } from "hono";

interface Props {}

export default async function (
  props: Props,
  context: Context<Env, string, {}>
) {
  return {
    message: "hello",
  };
}
