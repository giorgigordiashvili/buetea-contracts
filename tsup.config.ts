import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2021",
  treeshake: true,
  splitting: false, // single flat file per format — trivial NestJS require, avoids Metro exports edge cases
  external: ["zod"], // peer dependency, never bundled
});
