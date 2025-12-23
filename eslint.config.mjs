import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".firebase/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // React rules
      "react/jsx-curly-brace-presence": ["warn", "never"],
      "react/self-closing-comp": "warn",
      "react/jsx-boolean-value": ["warn", "never"],

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",

      // General rules
      "prefer-const": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["warn", "always"],
    },
  },
];

export default eslintConfig;
