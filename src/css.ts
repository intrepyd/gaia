import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

export async function buildCss(css: string) {
  const result = await postcss(
    [autoprefixer, tailwindcss, cssnano].filter(Boolean) as any
  ).process(css, { from: undefined });

  return result.css;
}

Bun.plugin({
  name: "Ignore css",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      return {
        exports: {},
        loader: "object",
      };
    });
  },
});
