/// <reference types="react-scripts" />

// react-scripts only declares "*.module.css" (CSS Modules); TypeScript 6's
// stricter TS2882 check now requires plain, non-module side-effect CSS
// imports (e.g. `import "./App.css"`) to have a matching declaration too.
declare module "*.css";
