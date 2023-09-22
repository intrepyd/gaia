import type { PropsWithChildren } from "react";
import { BaseLayout } from "./base-layout";

export function AppLayout({ children }: PropsWithChildren) {
  return <BaseLayout>{children}</BaseLayout>;
}
