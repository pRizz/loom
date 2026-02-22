// Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
// SPDX-License-Identifier: Proprietary

import { readFileSync } from 'fs';
import { relative } from 'path';

export function readText(path: string): string {
	return readFileSync(path, 'utf8');
}

export function toWorkspaceRelativePath(path: string, workspaceRoot: string): string {
	return relative(workspaceRoot, path).replaceAll('\\', '/');
}

export function lineNumberAtOffset(text: string, offset: number): number {
	let line = 1;
	for (let i = 0; i < offset && i < text.length; i++) {
		if (text.charCodeAt(i) === 10) {
			line += 1;
		}
	}
	return line;
}

export function toKebabCase(input: string): string {
	if (input.includes('-')) {
		return input.toLowerCase();
	}

	return input
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/_/g, '-')
		.toLowerCase();
}

export function stableSortById<T extends { id: string }>(items: T[]): T[] {
	return [...items].sort((a, b) => a.id.localeCompare(b.id));
}

export function dedupeById<T extends { id: string }>(items: T[]): T[] {
	const map = new Map<string, T>();
	for (const item of items) {
		if (!map.has(item.id)) {
			map.set(item.id, item);
		}
	}
	return [...map.values()];
}

export function routePathFromRouteFile(relativePath: string): { path: string; dynamic: boolean } {
	let route = relativePath.replace(/\/?\+page\.(svelte|svx)$/, '');
	if (route === '') {
		return { path: '/', dynamic: false };
	}

	const parts = route
		.split('/')
		.filter((part) => part.length > 0)
		.filter((part) => !(part.startsWith('(') && part.endsWith(')')));

	let dynamic = false;

	const normalized = parts.map((part) => {
		const rest = part.match(/^\[\.\.\.([^\]]+)\]$/);
		if (rest) {
			dynamic = true;
			return `*${rest[1]}`;
		}

		const param = part.match(/^\[([^\]]+)\]$/);
		if (param) {
			dynamic = true;
			return `:${param[1]}`;
		}

		return part;
	});

	return {
		path: `/${normalized.join('/')}`,
		dynamic,
	};
}

export function extractFrontmatterTitle(text: string): string | undefined {
	const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
	if (!frontmatter) {
		return undefined;
	}

	const title = frontmatter[1].match(/^title:\s*(.+)$/m);
	if (!title) {
		return undefined;
	}

	return title[1].trim().replace(/^"|"$/g, '');
}

export function extractFrontmatterSummary(text: string): string | undefined {
	const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
	if (!frontmatter) {
		return undefined;
	}

	const summary = frontmatter[1].match(/^summary:\s*(.+)$/m);
	if (!summary) {
		return undefined;
	}

	return summary[1].trim().replace(/^"|"$/g, '');
}
