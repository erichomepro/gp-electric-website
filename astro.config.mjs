// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Removes a leading markdown H1 from post bodies so each page has exactly one
// H1 (the layout-rendered post title). Prevents the duplicate-H1 SEO issue
// across every existing and future post without editing individual markdown.
function rehypeStripLeadingH1() {
  return (tree) => {
    const firstElementIndex = tree.children.findIndex((node) => node.type === 'element');
    if (firstElementIndex !== -1 && tree.children[firstElementIndex].tagName === 'h1') {
      tree.children.splice(firstElementIndex, 1);
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.gpelectricinc.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeStripLeadingH1]
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
