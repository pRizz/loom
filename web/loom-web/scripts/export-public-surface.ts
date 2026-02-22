#!/usr/bin/env tsx
/**
 * Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 * SPDX-License-Identifier: Proprietary
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import {
	buildCoverageRecord,
	extractCliSurface,
	extractHttpSurface,
	extractVsCodeSurface,
	extractWebSurface,
	getCoverageValidationErrors,
	type PublicSurfaceBundle,
	type SurfaceInventoryFile,
	type CliSurfaceItem,
	type HttpSurfaceItem,
	type VsCodeSurfaceItem,
	type WebSurfaceItem,
} from '../src/lib/docs/surface';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const webRoot = resolve(__dirname, '..');
const workspaceRoot = resolve(webRoot, '..', '..');
const outputDir = join(webRoot, 'src/lib/docs/generated');

const cliItems = extractCliSurface({ workspaceRoot });
const httpItems = extractHttpSurface({ workspaceRoot });
const webItems = extractWebSurface({ workspaceRoot });
const vscodeItems = extractVsCodeSurface({ workspaceRoot });

const allItems = [...cliItems, ...httpItems, ...webItems, ...vscodeItems];
const coverageErrors = getCoverageValidationErrors(allItems);

if (coverageErrors.length > 0) {
	console.error('Coverage metadata is missing for generated surface IDs:');
	for (const id of coverageErrors) {
		console.error(`  - ${id}`);
	}
	process.exit(1);
}

const coverage = buildCoverageRecord(allItems);

const cliFile: SurfaceInventoryFile<CliSurfaceItem> = {
	version: 1,
	domain: 'cli',
	items: cliItems,
};

const httpFile: SurfaceInventoryFile<HttpSurfaceItem> = {
	version: 1,
	domain: 'http',
	items: httpItems,
};

const webFile: SurfaceInventoryFile<WebSurfaceItem> = {
	version: 1,
	domain: 'web',
	items: webItems,
};

const vscodeFile: SurfaceInventoryFile<VsCodeSurfaceItem> = {
	version: 1,
	domain: 'vscode',
	items: vscodeItems,
};

const bundle: PublicSurfaceBundle = {
	version: 1,
	cli: cliFile,
	http: httpFile,
	web: webFile,
	vscode: vscodeFile,
	coverage,
};

const outputs: Array<{ path: string; data: unknown }> = [
	{ path: join(outputDir, 'cli-surface.json'), data: cliFile },
	{ path: join(outputDir, 'http-surface.json'), data: httpFile },
	{ path: join(outputDir, 'web-surface.json'), data: webFile },
	{ path: join(outputDir, 'vscode-surface.json'), data: vscodeFile },
	{ path: join(outputDir, 'surface-coverage.json'), data: coverage },
	{ path: join(outputDir, 'public-surface.json'), data: bundle },
];

const checkMode = process.argv.includes('--check');

if (!existsSync(outputDir)) {
	mkdirSync(outputDir, { recursive: true });
}

const mismatches: string[] = [];

for (const output of outputs) {
	const serialized = `${JSON.stringify(output.data, null, 2)}\n`;
	if (checkMode) {
		if (!existsSync(output.path)) {
			mismatches.push(output.path);
			continue;
		}

		const current = readFileSync(output.path, 'utf8');
		if (current !== serialized) {
			mismatches.push(output.path);
		}
		continue;
	}

	writeFileSync(output.path, serialized);
	console.log(`Wrote ${output.path}`);
}

if (checkMode && mismatches.length > 0) {
	console.error('Public surface inventory is stale or missing:');
	for (const path of mismatches) {
		console.error(`  - ${path}`);
	}
	console.error('\nRun `pnpm docs:surface` from web/loom-web to regenerate files.');
	process.exit(1);
}

if (checkMode) {
	console.log('Public surface inventory check passed.');
}
