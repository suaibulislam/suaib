import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://suaib.is-a.dev',
  integrations: [sitemap()],
  output: 'static',

  build: {
    assets: 'assets'
  },

  devToolbar: {
    enabled: false
  },

  vite: {
    build: {
      assetsInlineLimit: 0
    }
  },

  adapter: cloudflare()
});