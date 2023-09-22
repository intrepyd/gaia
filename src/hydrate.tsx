import { Fragment } from "react";
import { hydrateRoot } from "react-dom/client";
import { Router } from "wouter";

import Component, * as c from "__component__";
import "__config__";

const Layout = c?.config?.layout ?? Fragment;

hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <Router>
    <Layout>
      <Component />
    </Layout>
  </Router>
);
