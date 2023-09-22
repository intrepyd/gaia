import fs from "fs/promises";
import path from "path";
import { getConfig, preload } from "./page.tsx";
import { root } from "./utils.ts";

const config = await getConfig();

await fs.cp(
  path.join(root, config.publicDir),
  path.join(root, config.distDir),
  { recursive: true }
);

await preload().catch(console.error);
