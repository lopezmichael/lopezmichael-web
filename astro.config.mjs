import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lopezmichael.dev',
  output: 'static',
  integrations: [
    sitemap({
      // Keep internal/WIP routes out of the sitemap so crawlers don't surface them.
      filter: (page) => !page.includes('/preview/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
