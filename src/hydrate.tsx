import userConfig from "__config__";
import Component, * as c from "__component__";

import { hydrateRoot } from "react-dom/client";
import { Router } from "wouter";

const Layout = userConfig.layout ?? c.layout;

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <Router>
    <Layout>
      <Component />
    </Layout>
  </Router>
);
