import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/maplibre-gl-*.mjs",
    // This imperative MapLibre adapter is intentionally isolated from React's render model.
    "src/components/ui/map.tsx",
  ]),
]);

export default eslintConfig;
