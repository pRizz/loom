// Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
// SPDX-License-Identifier: Proprietary

import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

import type { WebSurfaceItem } from './types';
import {
	dedupeById,
	extractFrontmatterSummary,
	extractFrontmatterTitle,
	readText,
	routePathFromRouteFile,
	stableSortById,
	toWorkspaceRelativePath,
} from './utils';

function collectPageFiles(dir: string): string[] {
	const files: string[] = [];
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		const stats = statSync(fullPath);
		if (stats.isDirectory()) {
			files.push(...collectPageFiles(fullPath));
			continue;
		}

		if (entry === '+page.svelte' || entry === '+page.svx') {
			files.push(fullPath);
		}
	}
	return files.sort();
}

function titleFromPath(path: string): string {
	if (path === '/') {
		return 'Home';
	}

	const segment = path.split('/').filter(Boolean).at(-1) ?? path;
	if (segment.startsWith(':')) {
		return `Dynamic ${segment.slice(1)}`;
	}
	if (segment.startsWith('*')) {
		return `Catch-all ${segment.slice(1)}`;
	}

	return segment
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

interface ExtractWebSurfaceOptions {
	workspaceRoot: string;
}

export function extractWebSurface(options: ExtractWebSurfaceOptions): WebSurfaceItem[] {
	const { workspaceRoot } = options;
	const routesRoot = join(workspaceRoot, 'web/loom-web/src/routes');
	const pageFiles = collectPageFiles(routesRoot);

	const items: WebSurfaceItem[] = [];

	for (const file of pageFiles) {
		const relativeRoutePath = relative(routesRoot, file).replaceAll('\\', '/');
		const { path, dynamic } = routePathFromRouteFile(relativeRoutePath);
		const content = readText(file);

		const frontmatterTitle = file.endsWith('.svx') ? extractFrontmatterTitle(content) : undefined;
		const frontmatterSummary = file.endsWith('.svx') ? extractFrontmatterSummary(content) : undefined;

		items.push({
			id: `web:${path}`,
			domain: 'web',
			kind: 'page',
			label: frontmatterTitle ?? titleFromPath(path),
			summary: frontmatterSummary,
			path,
			dynamic,
			source: [
				{
					file: toWorkspaceRelativePath(file, workspaceRoot),
					line: 1,
				},
			],
		});
	}

	return stableSortById(dedupeById(items));
}
