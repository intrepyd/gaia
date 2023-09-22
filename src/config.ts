import type { FC, PropsWithChildren } from "react";

export interface Config {
  static: boolean;
  layout: FC<PropsWithChildren>;
  title: string;
  description: string;
  keywords: string;
  lang: string;
  distDir: string;
  pagesDir: string;
  publicDir: string;
  functionsDir: string;
  functionsPath: string;
  port: number;
}

export function defineConfig(userConfig: Partial<Config> = {}) {
  return userConfig;
}
