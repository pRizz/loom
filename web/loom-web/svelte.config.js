/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */

import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { readFileSync, readdirSync, statSync } from 'fs';
import { relative, join } from 'path';

const threadworkDark = JSON.parse(
	readFileSync('./src/lib/docs/themes/threadwork-dark.json', 'utf8')
);

const docsRootDir = './src/routes/(docs)/docs';

function collectDocsSvxEntries(currentDir = docsRootDir) {
	const entries = [];

	for (const entry of readdirSync(currentDir)) {
		const fullPath = join(currentDir, entry);
		const stats = statSync(fullPath);

		if (stats.isDirectory()) {
			entries.push(...collectDocsSvxEntries(fullPath));
			continue;
		}

		if (entry !== '+page.svx') {
			continue;
		}

		const relativePath = relative(docsRootDir, fullPath).replaceAll('\\', '/');
		const routePath = relativePath.replace('/+page.svx', '').replace('+page.svx', '');
		entries.push(`/docs/${routePath}`);
	}

	return entries.sort();
}

const docsPrerenderEntries = ['/docs', ...collectDocsSvxEntries()];

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexConfig = {
	extensions: ['.svx'],
	remarkPlugins: [remarkGfm],
	rehypePlugins: [
		rehypeSlug,
		[rehypeAutolinkHeadings, { behavior: 'wrap' }],
		[rehypePrettyCode, { theme: threadworkDark, keepBackground: false }],
	],
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx'],
	preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false,
		}),
		prerender: {
			entries: docsPrerenderEntries,
		},
		alias: {
			$lib: './src/lib',
			'$lib/*': './src/lib/*',
		},
	},
};

export default config;
