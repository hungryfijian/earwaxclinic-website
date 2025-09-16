// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Site configuration
	site: 'https://www.earwaxclinic.co.uk',
	base: '/',

	// Build configuration
	build: {
		assets: '_astro',
		inlineStylesheets: 'auto',
	},

	// Server configuration for development
	server: {
		port: 4321,
		host: true
	},

	// Enable trailing slashes to match existing URL structure
	trailingSlash: 'always',

	// Integrations
	integrations: [
		mdx(),
		sitemap({
			// Customize sitemap generation
			changefreq: 'weekly',
			priority: 0.7,
			lastmod: new Date(),
			// Custom entries for important pages
			customPages: [
				'https://www.earwaxclinic.co.uk/',
				'https://www.earwaxclinic.co.uk/treatments/',
				'https://www.earwaxclinic.co.uk/earwax-clinic-locations/',
				'https://www.earwaxclinic.co.uk/about-ear-wax/',
				'https://www.earwaxclinic.co.uk/ear-wax-faq/',
				'https://www.earwaxclinic.co.uk/testimonials/',
				'https://www.earwaxclinic.co.uk/micro-suction-training/',
			],
			// Filter out admin and API routes
			filter: (page) => !page.includes('/admin/') && !page.includes('/api/'),
		}),
	],

	// Markdown configuration
	markdown: {
		shikiConfig: {
			theme: 'github-light',
			wrap: true,
		},
		remarkPlugins: [],
		rehypePlugins: [],
	},

	// Image optimization
	image: {
		// Optimize images during build
		service: 'astro/assets/services/sharp',
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'image.jimcdn.com',
				pathname: '/app/cms/image/**',
			},
		],
	},

	// Vite configuration for additional optimization
	vite: {
		build: {
			// Minimize CSS
			cssCodeSplit: true,
			rollupOptions: {
				output: {
					// Organize build assets
					assetFileNames: (assetInfo) => {
						if (assetInfo.name?.endsWith('.css')) {
							return 'assets/css/[name]-[hash][extname]';
						}
						if (assetInfo.name?.match(/\.(png|jpe?g|svg|gif|webp)$/)) {
							return 'assets/images/[name]-[hash][extname]';
						}
						if (assetInfo.name?.match(/\.(woff2?|eot|ttf|otf)$/)) {
							return 'assets/fonts/[name]-[hash][extname]';
						}
						return 'assets/[name]-[hash][extname]';
					},
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js',
				},
			},
		},
		// CSS preprocessing
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@import "src/styles/variables.scss";`,
				},
			},
		},
		// Development optimizations
		optimizeDeps: {
			include: ['@astrojs/mdx'],
		},
	},

	// Experimental features
	experimental: {
		contentCollectionCache: true,
	},

	// Security headers (for deployment)
	security: {
		checkOrigin: true,
	},
});
