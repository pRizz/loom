// Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
// SPDX-License-Identifier: Proprietary

import cliSurfaceJson from '$lib/docs/generated/cli-surface.json';
import httpSurfaceJson from '$lib/docs/generated/http-surface.json';
import webSurfaceJson from '$lib/docs/generated/web-surface.json';
import vscodeSurfaceJson from '$lib/docs/generated/vscode-surface.json';
import coverageJson from '$lib/docs/generated/surface-coverage.json';

import type {
	CliSurfaceItem,
	HttpSurfaceItem,
	SurfaceCoverage,
	VsCodeSurfaceItem,
	WebSurfaceItem,
} from './types';

export interface SurfaceTableRow {
	id: string;
	label: string;
	summary?: string;
	method?: string;
	path?: string;
	audience: string;
	maturity: 'stable' | 'beta' | 'experimental' | 'internal';
	authScope: string;
	primaryDocsPath: string;
}

const coverage = coverageJson as Record<string, SurfaceCoverage>;
const cliSurface = (cliSurfaceJson as { items: CliSurfaceItem[] }).items;
const httpSurface = (httpSurfaceJson as { items: HttpSurfaceItem[] }).items;
const webSurface = (webSurfaceJson as { items: WebSurfaceItem[] }).items;
const vscodeSurface = (vscodeSurfaceJson as { items: VsCodeSurfaceItem[] }).items;

function withCoverage(itemId: string): SurfaceCoverage {
	const resolved = coverage[itemId];
	if (!resolved) {
		return {
			audience: 'developer',
			maturity: 'internal',
			authScope: 'unknown',
			primaryDocsPath: '/docs/reference/public-surface-matrix',
		};
	}
	return resolved;
}

function rowFromCli(item: CliSurfaceItem): SurfaceTableRow {
	const resolved = withCoverage(item.id);
	return {
		id: item.id,
		label: item.command,
		summary: item.summary,
		audience: resolved.audience,
		maturity: resolved.maturity,
		authScope: resolved.authScope,
		primaryDocsPath: resolved.primaryDocsPath,
	};
}

function rowFromHttp(item: HttpSurfaceItem): SurfaceTableRow {
	const resolved = withCoverage(item.id);
	return {
		id: item.id,
		label: `${item.method} ${item.path}`,
		summary: item.summary,
		method: item.method,
		path: item.path,
		audience: resolved.audience,
		maturity: resolved.maturity,
		authScope: resolved.authScope,
		primaryDocsPath: resolved.primaryDocsPath,
	};
}

function rowFromWeb(item: WebSurfaceItem): SurfaceTableRow {
	const resolved = withCoverage(item.id);
	return {
		id: item.id,
		label: item.path,
		summary: item.summary,
		path: item.path,
		audience: resolved.audience,
		maturity: resolved.maturity,
		authScope: resolved.authScope,
		primaryDocsPath: resolved.primaryDocsPath,
	};
}

function rowFromVsCode(item: VsCodeSurfaceItem): SurfaceTableRow {
	const resolved = withCoverage(item.id);
	const label =
		item.kind === 'command'
			? `${item.commandId} (${item.title})`
			: `${item.settingKey} (${item.settingType})`;

	return {
		id: item.id,
		label,
		summary: item.summary,
		audience: resolved.audience,
		maturity: resolved.maturity,
		authScope: resolved.authScope,
		primaryDocsPath: resolved.primaryDocsPath,
	};
}

export function getCliRows(): SurfaceTableRow[] {
	return cliSurface.map(rowFromCli);
}

export function getHttpRows(): SurfaceTableRow[] {
	return httpSurface.map(rowFromHttp);
}

export function getWebRows(): SurfaceTableRow[] {
	return webSurface.map(rowFromWeb);
}

export function getVsCodeRows(): SurfaceTableRow[] {
	return vscodeSurface.map(rowFromVsCode);
}

export function getAllSurfaceRows(): SurfaceTableRow[] {
	return [...getCliRows(), ...getHttpRows(), ...getWebRows(), ...getVsCodeRows()];
}

export function getSurfaceStats() {
	const rows = getAllSurfaceRows();

	const maturity = {
		stable: 0,
		beta: 0,
		experimental: 0,
		internal: 0,
	};
	for (const row of rows) {
		maturity[row.maturity] += 1;
	}

	return {
		total: rows.length,
		cli: cliSurface.length,
		http: httpSurface.length,
		web: webSurface.length,
		vscode: vscodeSurface.length,
		maturity,
	};
}
