import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lopezmichael.dev',
  output: 'static',
  integrations: [
    sitemap({
      // Keep internal/WIP routes out of the sitemap so crawlers don't surface them.
      // /work-with-me/ is hidden while job searching: off the nav, noindexed, out of the sitemap.
      filter: (page) => !page.includes('/preview/') && !page.includes('/work-with-me/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
