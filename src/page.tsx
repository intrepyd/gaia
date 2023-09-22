import { build as esbuild } from "esbuild";
import fs from "fs/promises";
import path from "path";
import { Fragment, ReactElement } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { Router } from "wouter";
import { Config } from "./config.ts";
import { buildCss } from "./css.ts";
import { WATCH } from "./dev.ts";
import { mdxPlugin } from "./mdx.ts";
import { dirname, root } from "./utils.ts";

const darkModeCode = await Bun.file(path.join(dirname, "dark-mode.js")).text();
const refreshCode = await Bun.file(path.join(dirname, "refresh.js")).text();

export const defaultConfig: Config = {
  static: false,
  layout: Fragment,
  title: "Gaia",
  description: "Powered by Gaia",
  keywords: "web,app,react,ssr",
  lang: "en",
  distDir: "dist",
  pagesDir: "pages",
  publicDir: "public",
  functionsDir: "functions",
  functionsPath: "/api",
  port: 3000,
};

export async function getConfig(
  pageConfig: Partial<Config> = {}
): Promise<Config> {
  try {
    const { default: userConfig } = await import(
      path.join(root, "gaia.config.ts")
    );

    return { ...defaultConfig, ...userConfig, ...pageConfig };
  } catch (error) {
    return { ...defaultConfig, ...pageConfig };
  }
}

const config = await getConfig();

export async function guessPath(route: string) {
  const files = [
    path.join(root, config.pagesDir, route + ".tsx"),
    path.join(root, config.pagesDir, route, "index.tsx"),
    path.join(root, config.pagesDir, route + ".mdx"),
    path.join(root, config.pagesDir, route, "index.mdx"),
    path.join(root, config.pagesDir, route + ".md"),
    path.join(root, config.pagesDir, route, "index.md"),
  ];

  for (const file of files) {
    const exists = await Bun.file(file).exists();

    if (exists) {
      return file;
    }
  }

  return "";
}

export async function render({
  styles,
  bundle,
  content,
  config,
}: {
  styles: string;
  bundle: string;
  content: ReactElement;
  config: Config;
}) {
  const { static: isStatic, title, description, keywords, lang } = config;
  const styleTag = styles ? `<style>${styles}</style>` : "";
  const darkModeScript = styleTag ? `<script>${darkModeCode}</script>` : "";
  const refreshScript = WATCH ? `<script>${refreshCode}</script>` : "";
  const bundleScript = isStatic
    ? ""
    : `<script type="module">${bundle}</script>`;
  const rendered = isStatic
    ? renderToStaticMarkup(content)
    : renderToString(content);

  return `<!DOCTYPE html>
          <html lang="${lang}">
            <head>
              <meta charSet="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" />
              <link rel="manifest" href="/site.webmanifest" />
              <title>${title}</title>
              <meta name="title" content="${title}" />
              <meta name="description" content="${description}" />
              <meta name="keywords" content="${keywords}" />
              <meta property="og:type" content="website" />
              <meta property="og:title" content="${title}" />
              <meta property="og:description" content="${description}" />
              ${styleTag}
              ${darkModeScript}
            </head>
            <body>
              <div id="root">${rendered}</div>
              ${bundleScript}${refreshScript}
            </body>
          </html>`;
}

export async function html(file: string, location: string) {
  const { default: Component, config: pageConfig } = await import(file);
  const config = await getConfig(pageConfig);

  const [bundle, css] = await esbuild({
    write: false,
    minify: !WATCH,
    treeShaking: true,
    bundle: true,
    target: ["chrome109", "edge112", "firefox102", "safari16"],
    format: "esm",
    jsx: "automatic",
    entryPoints: [path.join(dirname, "hydrate.tsx")],
    plugins: [mdxPlugin],
    alias: {
      __component__: String(file),
      __config__: String(path.join(root, "gaia.config.ts")),
    },
    outdir: "dist",
  }).then((r) => {
    return [r.outputFiles[0].text, r.outputFiles[1]?.text ?? ""];
  });

  const styles = css ? await buildCss(css) : "";

  const Layout = config.layout;

  const content = (
    <Router ssrPath={location}>
      <Layout>
        <Component />
      </Layout>
    </Router>
  );

  return render({ styles, bundle, config, content });
}

function isValidExtension(filePath: string) {
  return [".ts", ".tsx", ".mdx"].includes(path.extname(filePath));
}

export async function preloadEntries(dirPath: string, distPath: string) {
  const entries = await fs.readdir(dirPath, {
    withFileTypes: true,
  });
  const result: {
    dist: string;
    file: string;
    location: string;
  }[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const dirResult = await preloadEntries(
        path.join(dirPath, entry.name),
        path.join(distPath, entry.name)
      );
      result.push(...dirResult);
    }

    const isValidFile = entry.isFile() && isValidExtension(entry.name);

    if (isValidFile) {
      const file = path.join(dirPath, entry.name);
      const extension = path.extname(file);
      const location =
        file
          .replace(path.join(root, config.pagesDir), "")
          .replace(extension, "")
          .replace("/index", "") || "/";

      const dist = path.join(
        file
          .replace(
            path.join(root, config.pagesDir),
            path.join(root, config.distDir)
          )
          .replace(extension, "")
          .replace("index", ""),
        "index.html"
      );

      await fs.mkdir(path.dirname(dist), { recursive: true });
      const content = await html(file, location);
      await Bun.write(dist, content);
      console.log(` 📜 ${location}`);
    }
  }

  return result;
}

export async function preload() {
  console.time("copy public");
  await fs.cp(
    path.join(root, config.publicDir),
    path.join(root, config.distDir),
    { recursive: true }
  );
  console.timeEnd("copy public");

  console.time("preload pages");
  await preloadEntries(
    path.join(root, config.pagesDir),
    path.join(root, config.distDir)
  );
  console.timeEnd("preload pages");
}
