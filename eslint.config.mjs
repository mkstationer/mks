import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extend and override rules
const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "@next/next/no-img-element": "off", // disable img rule
      "react-hooks/exhaustive-deps": "off", // example: disable React Hooks deps warning
    "react/no-unescaped-entities": "off", 
    },
  },
];

export default eslintConfig;
