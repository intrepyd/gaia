#!/usr/bin/env bun

import child from "child_process";
import path from "path";
import sade from "sade";
import packageJson from "../package.json";
import { dirname } from "./utils";

const prog = sade("gaia");

prog.version(packageJson.version);

prog.command("dev").action(() => {
  const process = child.spawn(
    "bun",
    ["run", "--hot", path.join(dirname, "start.ts")],
    {
      env: {
        WATCH: "true",
      },
    }
  );

  process.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  process.stderr.on("data", (data) => {
    console.log(data.toString());
  });
});

prog.command("build").action(() => {
  const process = child.spawn("bun", ["run", path.join(dirname, "start.ts")]);

  process.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  process.stderr.on("data", (data) => {
    console.log(data.toString());
  });
});

prog.command("preload").action(() => {
  const process = child.spawn("bun", ["run", path.join(dirname, "preload.ts")]);

  process.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  process.stderr.on("data", (data) => {
    console.log(data.toString());
  });
});

prog.parse(process.argv);
