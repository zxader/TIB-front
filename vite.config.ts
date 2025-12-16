import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { i18nReplace } from "./plugins/vite-plugin-i18n-replace";

const lang = process.env.VITE_I18N_LANG || "ko";

export default defineConfig({
  plugins: [react(), i18nReplace(lang)],
  base: `/${lang}/`,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
