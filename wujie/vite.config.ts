import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
// import vue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue-jsx'
// import ViteComponents, { AntDesignVueResolver } from 'unplugin-vue-components'
// import Components from 'unplugin-vue-components/vite'
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // vue({
    //   template: {
    //     compilerOptions: {
    //       isCustomElement: (tag) => tag.startsWith("sl-"),
    //     },
    //   },
    // }),
    // vueJsx({
    //   isCustomElement: (tag) => tag.startsWith("sl-"),
    // }),
    // Components({
    //   resolvers: [AntDesignVueResolver()],
    // }),
    // ViteComponents({
    //   customComponentResolvers: [AntDesignVueResolver()]
    // })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
