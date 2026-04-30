import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  }
});
