import "../styles/styles.css";

import { Suspense, type PropsWithChildren } from "react";
import { ThemeProvider } from "./theme";

export function BaseLayout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <ThemeProvider>{children}</ThemeProvider>
    </Suspense>
  );
}
