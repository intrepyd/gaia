import "../styles/content.css";

import type { PropsWithChildren } from "react";
import { BaseLayout } from "./base-layout.tsx";
import { DocsNavbar } from "./docs-navbar.tsx";

export function DocsLayout({ children }: PropsWithChildren) {
  return (
    <BaseLayout>
      <main className="mt-28 mb-20">
        <DocsNavbar />

        <div className="w-full max-w-3xl mx-auto prose dark:prose-invert overflow-auto">
          {children}
        </div>
      </main>
    </BaseLayout>
  );
}
