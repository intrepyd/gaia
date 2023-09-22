import mdx from "@mdx-js/esbuild";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

export const mdxPlugin = mdx({
  development: process.env.WATCH === "true",
  useDynamicImport: true,
  remarkPlugins: [[remarkToc, { tight: true, ordered: true }], remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        properties: {
          className: ["anchor"],
        },
      },
    ],
    rehypeCodeTitles,
    rehypeHighlight,
  ],
});

Bun.plugin({
  name: mdxPlugin.name,
  setup: mdxPlugin.setup,
});
