// Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
// SPDX-License-Identifier: Proprietary

import { join } from 'path';

import type { HttpSurfaceItem } from './types';
import {
	dedupeById,
	lineNumberAtOffset,
	readText,
	stableSortById,
	toWorkspaceRelativePath,
} from './utils';

type RouteScope = HttpSurfaceItem['routeScope'];

interface RouteCall {
	path: string;
	methods: string[];
	line: number;
}

interface FileRouteOptions {
	basePath?: string;
	defaultScope: RouteScope;
	scopeResolver?: (line: number) => RouteScope;
}

function findMatchingBrace(text: string, openIndex: number): number {
	let depth = 0;
	let inString = false;
	let escaping = false;

	for (let i = openIndex; i < text.length; i++) {
		const char = text[i];

		if (inString) {
			if (escaping) {
				escaping = false;
				continue;
			}
			if (char === '\\') {
				escaping = true;
				continue;
			}
			if (char === '"') {
				inString = false;
			}
			continue;
		}

		if (char === '"') {
			inString = true;
			continue;
		}

		if (char === '{') {
			depth += 1;
		}

		if (char === '}') {
			depth -= 1;
			if (depth === 0) {
				return i;
			}
		}
	}

	return -1;
}

function findFunctionLineRange(source: string, signatureRegex: RegExp): { start: number; end: number } | null {
	const match = source.match(signatureRegex);
	if (!match || match.index === undefined) {
		return null;
	}

	const openBraceIndex = source.indexOf('{', match.index);
	if (openBraceIndex === -1) {
		return null;
	}
	const closeBraceIndex = findMatchingBrace(source, openBraceIndex);
	if (closeBraceIndex === -1) {
		return null;
	}

	return {
		start: lineNumberAtOffset(source, openBraceIndex),
		end: lineNumberAtOffset(source, closeBraceIndex),
	};
}

function parseMethods(routeExpression: string): string[] {
	const methods: string[] = [];
	for (const match of routeExpression.matchAll(/\b(get|post|put|patch|delete|options|head)\s*\(/g)) {
		const method = match[1].toUpperCase();
		if (!methods.includes(method)) {
			methods.push(method);
		}
	}
	if (methods.length === 0) {
		return ['ANY'];
	}
	return methods;
}

function parseRouteCalls(source: string): RouteCall[] {
	const calls: RouteCall[] = [];
	let cursor = 0;

	while (cursor < source.length) {
		const routeIndex = source.indexOf('.route(', cursor);
		if (routeIndex === -1) {
			break;
		}

		const openParenIndex = routeIndex + '.route'.length;
		if (source[openParenIndex] !== '(') {
			cursor = routeIndex + 1;
			continue;
		}

		let depth = 1;
		let inString = false;
		let escaping = false;
		let seenSeparator = false;
		let firstArg = '';
		let secondArg = '';
		let index = openParenIndex + 1;

		while (index < source.length && depth > 0) {
			const char = source[index];

			if (inString) {
				if (escaping) {
					escaping = false;
					if (seenSeparator) {
						secondArg += char;
					} else {
						firstArg += char;
					}
					index += 1;
					continue;
				}
				if (char === '\\') {
					escaping = true;
					if (seenSeparator) {
						secondArg += char;
					} else {
						firstArg += char;
					}
					index += 1;
					continue;
				}
				if (char === '"') {
					inString = false;
				}
				if (seenSeparator) {
					secondArg += char;
				} else {
					firstArg += char;
				}
				index += 1;
				continue;
			}

			if (char === '"') {
				inString = true;
				if (seenSeparator) {
					secondArg += char;
				} else {
					firstArg += char;
				}
				index += 1;
				continue;
			}

			if (char === '(') depth += 1;
			if (char === ')') {
				depth -= 1;
				if (depth === 0) {
					index += 1;
					break;
				}
			}

			if (char === ',' && depth === 1 && !seenSeparator) {
				seenSeparator = true;
				index += 1;
				continue;
			}

			if (seenSeparator) {
				secondArg += char;
			} else {
				firstArg += char;
			}

			index += 1;
		}

		cursor = index;
		const pathMatch = firstArg.match(/"([^"]+)"/);
		if (!pathMatch) {
			continue;
		}

		calls.push({
			path: pathMatch[1],
			methods: parseMethods(secondArg),
			line: lineNumberAtOffset(source, routeIndex),
		});
	}

	return calls;
}

function joinPath(prefix: string | undefined, path: string): string {
	if (!prefix || prefix === '') {
		return path;
	}
	const normalizedPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return `${normalizedPrefix}${normalizedPath}`;
}

function extractRoutesFromFile(
	source: string,
	sourceFile: string,
	options: FileRouteOptions,
	workspaceRoot: string
): HttpSurfaceItem[] {
	const calls = parseRouteCalls(source);
	const items: HttpSurfaceItem[] = [];

	for (const call of calls) {
		const scope = options.scopeResolver?.(call.line) ?? options.defaultScope;
		let path = joinPath(options.basePath, call.path);
		if (scope === 'admin' && path.startsWith('/')) {
			path = joinPath('/api/admin', path);
		}

		for (const method of call.methods) {
			items.push({
				id: `http:${method}:${path}`,
				domain: 'http',
				kind: 'route',
				label: `${method} ${path}`,
				summary: `${scope} route`,
				method,
				path,
				routeScope: scope,
				source: [
					{
						file: toWorkspaceRelativePath(sourceFile, workspaceRoot),
						line: call.line,
					},
				],
			});
		}
	}

	return items;
}

function createApiScopeResolver(source: string): (line: number) => RouteScope {
	const adminRange = findFunctionLineRange(source, /fn\s+admin_routes\s*\(/);
	const createRouterRange = findFunctionLineRange(source, /pub\s+fn\s+create_router\s*\(/);
	const publicStart = source.indexOf('let public = PublicRouter::new()');
	const authedStart = source.indexOf('let mut authed = AuthedRouter::new()');

	const publicStartLine = publicStart >= 0 ? lineNumberAtOffset(source, publicStart) : Number.MAX_SAFE_INTEGER;
	const authedStartLine = authedStart >= 0 ? lineNumberAtOffset(source, authedStart) : Number.MAX_SAFE_INTEGER;

	return (line: number): RouteScope => {
		if (adminRange && line >= adminRange.start && line <= adminRange.end) {
			return 'admin';
		}

		if (line >= publicStartLine && line < authedStartLine) {
			return 'public';
		}

		if (createRouterRange && line >= authedStartLine && line <= createRouterRange.end) {
			return 'authenticated';
		}

		return 'unknown';
	};
}

interface ExtractHttpSurfaceOptions {
	workspaceRoot: string;
}

export function extractHttpSurface(options: ExtractHttpSurfaceOptions): HttpSurfaceItem[] {
	const { workspaceRoot } = options;

	const apiFile = join(workspaceRoot, 'crates/loom-server/src/api.rs');
	const gitRouterFile = join(workspaceRoot, 'crates/loom-server/src/routes/git/router.rs');
	const gitBrowserFile = join(workspaceRoot, 'crates/loom-server/src/routes/git_browser/router.rs');
	const scimRoutesFile = join(workspaceRoot, 'crates/loom-server-scim/src/routes.rs');

	const apiSource = readText(apiFile);
	const gitSource = readText(gitRouterFile);
	const gitBrowserSource = readText(gitBrowserFile);
	const scimSource = readText(scimRoutesFile);

	const apiRoutes = extractRoutesFromFile(
		apiSource,
		apiFile,
		{
			defaultScope: 'unknown',
			scopeResolver: createApiScopeResolver(apiSource),
		},
		workspaceRoot
	);
	const gitRoutes = extractRoutesFromFile(
		gitSource,
		gitRouterFile,
		{
			defaultScope: 'optional-auth',
		},
		workspaceRoot
	);
	const gitBrowserRoutes = extractRoutesFromFile(
		gitBrowserSource,
		gitBrowserFile,
		{
			defaultScope: 'optional-auth',
		},
		workspaceRoot
	);
	const scimRoutes = extractRoutesFromFile(
		scimSource,
		scimRoutesFile,
		{
			basePath: '/api/scim',
			defaultScope: 'scim',
		},
		workspaceRoot
	);

	return stableSortById(dedupeById([...apiRoutes, ...gitRoutes, ...gitBrowserRoutes, ...scimRoutes]));
}
