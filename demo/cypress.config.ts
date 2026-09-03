import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    // Desktop-sized viewport: both editors have separate mobile-responsive
    // show/hide CSS for the visual/text panes (and default to OPPOSITE
    // initial states there — see main bug report), which is out of scope
    // for these shared behavioral scenarios.
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
