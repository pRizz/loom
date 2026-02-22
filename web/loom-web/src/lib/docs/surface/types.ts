// Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
// SPDX-License-Identifier: Proprietary

export type SurfaceDomain = 'cli' | 'http' | 'web' | 'vscode';

export type SurfaceAudience = 'end-user' | 'admin' | 'integrator' | 'operator' | 'developer';

export type SurfaceMaturity = 'stable' | 'beta' | 'experimental' | 'internal';

export interface SourceLocation {
	file: string;
	line: number;
}

export interface SurfaceCoverage {
	audience: SurfaceAudience;
	maturity: SurfaceMaturity;
	authScope: string;
	primaryDocsPath: string;
}

export interface SurfaceItemBase {
	id: string;
	domain: SurfaceDomain;
	kind: string;
	label: string;
	summary?: string;
	source: SourceLocation[];
}

export interface CliSurfaceItem extends SurfaceItemBase {
	domain: 'cli';
	kind: 'command';
	command: string;
	parentCommand: string | null;
	depth: number;
}

export interface HttpSurfaceItem extends SurfaceItemBase {
	domain: 'http';
	kind: 'route';
	method: string;
	path: string;
	routeScope: 'public' | 'authenticated' | 'admin' | 'optional-auth' | 'scim' | 'unknown';
}

export interface WebSurfaceItem extends SurfaceItemBase {
	domain: 'web';
	kind: 'page';
	path: string;
	dynamic: boolean;
}

export interface VsCodeCommandSurfaceItem extends SurfaceItemBase {
	domain: 'vscode';
	kind: 'command';
	commandId: string;
	title: string;
	category?: string;
	keybinding?: string;
}

export interface VsCodeSettingSurfaceItem extends SurfaceItemBase {
	domain: 'vscode';
	kind: 'setting';
	settingKey: string;
	settingType: string;
	defaultValue: unknown;
}

export type VsCodeSurfaceItem = VsCodeCommandSurfaceItem | VsCodeSettingSurfaceItem;

export type PublicSurfaceItem = CliSurfaceItem | HttpSurfaceItem | WebSurfaceItem | VsCodeSurfaceItem;

export interface SurfaceInventoryFile<T extends PublicSurfaceItem> {
	version: number;
	domain: SurfaceDomain;
	items: T[];
}

export interface PublicSurfaceBundle {
	version: number;
	cli: SurfaceInventoryFile<CliSurfaceItem>;
	http: SurfaceInventoryFile<HttpSurfaceItem>;
	web: SurfaceInventoryFile<WebSurfaceItem>;
	vscode: SurfaceInventoryFile<VsCodeSurfaceItem>;
	coverage: Record<string, SurfaceCoverage>;
}
