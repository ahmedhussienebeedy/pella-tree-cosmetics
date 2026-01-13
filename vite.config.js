import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // base path ديناميكي حسب البيئة
  base: process.env.VERCEL
    ? "/" // لو deploy على Vercel
    : process.env.NODE_ENV === "production"
    ? "/pella-tree-cosmetics/" // لو deploy على GitHub Pages
    : "/", // localhost
});
