// Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
// SPDX-License-Identifier: Proprietary

import type { HttpSurfaceItem, PublicSurfaceItem, SurfaceCoverage } from './types';

interface CoverageRule {
	idPrefix?: string;
	domain?: PublicSurfaceItem['domain'];
	kind?: PublicSurfaceItem['kind'];
	routeScope?: HttpSurfaceItem['routeScope'];
	pathPrefix?: string;
	coverage: SurfaceCoverage;
}

const COVERAGE_RULES: CoverageRule[] = [
	{
		idPrefix: 'cli:loom.spool',
		coverage: {
			audience: 'end-user',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/reference/cli',
		},
	},
	{
		idPrefix: 'cli:loom.crash',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		idPrefix: 'cli:loom.crons',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		idPrefix: 'cli:loom.sessions',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		idPrefix: 'cli:loom.weaver',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/weaver-remote-execution',
		},
	},
	{
		idPrefix: 'cli:loom.new',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/weaver-remote-execution',
		},
	},
	{
		idPrefix: 'cli:loom.attach',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/weaver-remote-execution',
		},
	},
	{
		idPrefix: 'cli:loom.tunnel',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/how-to/use-wireguard-ssh',
		},
	},
	{
		idPrefix: 'cli:loom.ssh',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/how-to/use-wireguard-ssh',
		},
	},
	{
		idPrefix: 'cli:loom.wg',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/how-to/use-wireguard-ssh',
		},
	},
	{
		idPrefix: 'cli:loom.credential-helper',
		coverage: {
			audience: 'integrator',
			maturity: 'experimental',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/reference/cli',
		},
	},
	{
		domain: 'http',
		routeScope: 'admin',
		coverage: {
			audience: 'admin',
			maturity: 'internal',
			authScope: 'system-admin',
			primaryDocsPath: '/docs/how-to/manage-orgs-teams-api-keys',
		},
	},
	{
		domain: 'http',
		routeScope: 'scim',
		coverage: {
			audience: 'integrator',
			maturity: 'stable',
			authScope: 'scim-bearer',
			primaryDocsPath: '/docs/how-to/configure-scim',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/health',
		coverage: {
			audience: 'operator',
			maturity: 'stable',
			authScope: 'public',
			primaryDocsPath: '/docs/how-to/configure-server',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/metrics',
		coverage: {
			audience: 'operator',
			maturity: 'stable',
			authScope: 'public',
			primaryDocsPath: '/docs/how-to/configure-server',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/ping',
		coverage: {
			audience: 'operator',
			maturity: 'stable',
			authScope: 'public-key',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/api/scim',
		coverage: {
			audience: 'integrator',
			maturity: 'stable',
			authScope: 'scim-bearer',
			primaryDocsPath: '/docs/how-to/configure-scim',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/api/wg',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/how-to/use-wireguard-ssh',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/api/weaver',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/weaver-remote-execution',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/api/weavers',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/weaver-remote-execution',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/mcp',
		coverage: {
			audience: 'integrator',
			maturity: 'experimental',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/reference/http-api',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/git',
		coverage: {
			audience: 'integrator',
			maturity: 'beta',
			authScope: 'mixed',
			primaryDocsPath: '/docs/tutorials/repo-and-clips-workflow',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/api/repos',
		coverage: {
			audience: 'end-user',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/repo-and-clips-workflow',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/api/clips',
		coverage: {
			audience: 'end-user',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/repo-and-clips-workflow',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/api/crons',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/api/crash',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/api/sessions',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		domain: 'http',
		pathPrefix: '/proxy',
		coverage: {
			audience: 'integrator',
			maturity: 'experimental',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/reference/http-api',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/docs',
		coverage: {
			audience: 'end-user',
			maturity: 'stable',
			authScope: 'public',
			primaryDocsPath: '/docs/reference/public-surface-matrix',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/admin',
		coverage: {
			audience: 'admin',
			maturity: 'internal',
			authScope: 'system-admin',
			primaryDocsPath: '/docs/how-to/manage-orgs-teams-api-keys',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/weavers',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/weaver-remote-execution',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/repos',
		coverage: {
			audience: 'end-user',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/repo-and-clips-workflow',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/clips',
		coverage: {
			audience: 'end-user',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/repo-and-clips-workflow',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/crashes',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/crons',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/sessions',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/analytics',
		coverage: {
			audience: 'operator',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/tutorials/observability-incident-response',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/settings/orgs',
		coverage: {
			audience: 'admin',
			maturity: 'beta',
			authScope: 'org-admin',
			primaryDocsPath: '/docs/how-to/manage-orgs-teams-api-keys',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/api',
		coverage: {
			audience: 'integrator',
			maturity: 'experimental',
			authScope: 'public',
			primaryDocsPath: '/docs/reference/http-api',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/proxy',
		coverage: {
			audience: 'integrator',
			maturity: 'experimental',
			authScope: 'public',
			primaryDocsPath: '/docs/reference/http-api',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/bin',
		coverage: {
			audience: 'integrator',
			maturity: 'experimental',
			authScope: 'public',
			primaryDocsPath: '/docs/reference/http-api',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/health',
		coverage: {
			audience: 'operator',
			maturity: 'stable',
			authScope: 'public',
			primaryDocsPath: '/docs/how-to/configure-server',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/login',
		coverage: {
			audience: 'end-user',
			maturity: 'stable',
			authScope: 'public',
			primaryDocsPath: '/docs/how-to/configure-auth',
		},
	},
	{
		domain: 'web',
		pathPrefix: '/device',
		coverage: {
			audience: 'end-user',
			maturity: 'stable',
			authScope: 'public',
			primaryDocsPath: '/docs/how-to/configure-auth',
		},
	},
	{
		domain: 'vscode',
		kind: 'command',
		coverage: {
			audience: 'developer',
			maturity: 'beta',
			authScope: 'local-editor',
			primaryDocsPath: '/docs/reference/vscode-extension',
		},
	},
	{
		domain: 'vscode',
		kind: 'setting',
		coverage: {
			audience: 'developer',
			maturity: 'beta',
			authScope: 'local-editor',
			primaryDocsPath: '/docs/reference/vscode-extension',
		},
	},
	{
		domain: 'cli',
		coverage: {
			audience: 'end-user',
			maturity: 'stable',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/reference/cli',
		},
	},
	{
		domain: 'http',
		routeScope: 'public',
		coverage: {
			audience: 'end-user',
			maturity: 'beta',
			authScope: 'public',
			primaryDocsPath: '/docs/reference/http-api',
		},
	},
	{
		domain: 'http',
		routeScope: 'authenticated',
		coverage: {
			audience: 'end-user',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/reference/http-api',
		},
	},
	{
		domain: 'http',
		routeScope: 'optional-auth',
		coverage: {
			audience: 'integrator',
			maturity: 'experimental',
			authScope: 'mixed',
			primaryDocsPath: '/docs/reference/http-api',
		},
	},
	{
		domain: 'http',
		coverage: {
			audience: 'developer',
			maturity: 'internal',
			authScope: 'unknown',
			primaryDocsPath: '/docs/reference/http-api',
		},
	},
	{
		domain: 'web',
		coverage: {
			audience: 'end-user',
			maturity: 'beta',
			authScope: 'authenticated',
			primaryDocsPath: '/docs/reference/web-ui',
		},
	},
];

function getItemPath(item: PublicSurfaceItem): string | null {
	if (item.domain === 'http') {
		return item.path;
	}
	if (item.domain === 'web') {
		return item.path;
	}
	return null;
}

function matchesRule(item: PublicSurfaceItem, rule: CoverageRule): boolean {
	if (rule.domain && item.domain !== rule.domain) {
		return false;
	}
	if (rule.kind && item.kind !== rule.kind) {
		return false;
	}
	if (rule.idPrefix && !item.id.startsWith(rule.idPrefix)) {
		return false;
	}
	if (rule.routeScope && item.domain === 'http' && item.routeScope !== rule.routeScope) {
		return false;
	}
	if (rule.routeScope && item.domain !== 'http') {
		return false;
	}
	if (rule.pathPrefix) {
		const itemPath = getItemPath(item);
		if (!itemPath || !itemPath.startsWith(rule.pathPrefix)) {
			return false;
		}
	}
	return true;
}

export function resolveSurfaceCoverage(item: PublicSurfaceItem): SurfaceCoverage | null {
	for (const rule of COVERAGE_RULES) {
		if (matchesRule(item, rule)) {
			return rule.coverage;
		}
	}
	return null;
}

export function buildCoverageRecord(items: PublicSurfaceItem[]): Record<string, SurfaceCoverage> {
	const record: Record<string, SurfaceCoverage> = {};
	for (const item of items) {
		const coverage = resolveSurfaceCoverage(item);
		if (coverage) {
			record[item.id] = coverage;
		}
	}
	return record;
}

export function getCoverageValidationErrors(items: PublicSurfaceItem[]): string[] {
	const missing = items.filter((item) => resolveSurfaceCoverage(item) === null);
	return missing.map((item) => item.id);
}
