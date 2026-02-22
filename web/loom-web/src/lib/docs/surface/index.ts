// Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
// SPDX-License-Identifier: Proprietary

export * from './types';
export { extractCliSurface } from './extract-cli';
export { extractHttpSurface } from './extract-http-routes';
export { extractWebSurface } from './extract-web-routes';
export { extractVsCodeSurface } from './extract-vscode';
export {
	resolveSurfaceCoverage,
	buildCoverageRecord,
	getCoverageValidationErrors,
} from './coverage-map';
