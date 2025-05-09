// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///D:/3newegg/egg-web-api/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/3newegg/egg-web-api/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///D:/3newegg/egg-web-api/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import vueSetupExtend from "file:///D:/3newegg/egg-web-api/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\3newegg\\egg-web-api";
var vite_config_default = defineConfig({
  base: "./",
  resolve: {
    // 配置别名
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src"),
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
    }
  },
  plugins: [
    vue(),
    vueSetupExtend(),
    createSvgIconsPlugin({
      iconDirs: [resolve(__vite_injected_original_dirname, "src/icons/svg")],
      symbolId: "icon-[dir]-[name]"
    })
  ],
  server: {
    host: "0.0.0.0",
    port: 3e3,
    // 端口号
    open: false
    // 是否自动打开浏览器
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFwzbmV3ZWdnXFxcXGVnZy13ZWItYXBpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFwzbmV3ZWdnXFxcXGVnZy13ZWItYXBpXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi8zbmV3ZWdnL2VnZy13ZWItYXBpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnXHJcbmltcG9ydCB2dWVTZXR1cEV4dGVuZCBmcm9tICd2aXRlLXBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kJ1xyXG5cclxuLy8gXHU1M0MyXHU4MDAzXHVGRjFBaHR0cHM6Ly9jbi52aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuXHRiYXNlOiAnLi8nLFxyXG5cdHJlc29sdmU6IHtcclxuXHRcdC8vIFx1OTE0RFx1N0Y2RVx1NTIyQlx1NTQwRFxyXG5cdFx0YWxpYXM6IHtcclxuXHRcdFx0J0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcblx0XHRcdCd2dWUtaTE4bic6ICd2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmNqcy5qcydcclxuXHRcdH1cclxuXHR9LFxyXG5cdHBsdWdpbnM6IFtcclxuXHRcdHZ1ZSgpLFxyXG5cdFx0dnVlU2V0dXBFeHRlbmQoKSxcclxuXHRcdGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuXHRcdFx0aWNvbkRpcnM6IFtyZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pY29ucy9zdmcnKV0sXHJcblx0XHRcdHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nXHJcblx0XHR9KVxyXG5cdF0sXHJcblx0c2VydmVyOiB7XHJcblx0XHRob3N0OiAnMC4wLjAuMCcsXHJcblx0XHRwb3J0OiAzMDAwLCAvLyBcdTdBRUZcdTUzRTNcdTUzRjdcclxuXHRcdG9wZW46IGZhbHNlIC8vIFx1NjYyRlx1NTQyNlx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NkQ0Rlx1ODlDOFx1NTY2OFxyXG5cdH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUCxTQUFTLGVBQWU7QUFDbFIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBRWhCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sb0JBQW9CO0FBTDNCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQTtBQUFBLElBRVIsT0FBTztBQUFBLE1BQ04sS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUMvQixZQUFZO0FBQUEsSUFDYjtBQUFBLEVBQ0Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLElBQUk7QUFBQSxJQUNKLGVBQWU7QUFBQSxJQUNmLHFCQUFxQjtBQUFBLE1BQ3BCLFVBQVUsQ0FBQyxRQUFRLGtDQUFXLGVBQWUsQ0FBQztBQUFBLE1BQzlDLFVBQVU7QUFBQSxJQUNYLENBQUM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLEVBQ1A7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
