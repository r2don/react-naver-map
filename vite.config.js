const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "@r2don/react-naver-map",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "umd"],
    },
    minify: "esbuild",
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    coverage: { reporter: ["json"] },
  },
});