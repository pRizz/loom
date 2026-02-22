// Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
// SPDX-License-Identifier: Proprietary

import { readdirSync, statSync } from 'fs';
import { join } from 'path';

import type { CliSurfaceItem, SourceLocation } from './types';
import {
	dedupeById,
	readText,
	stableSortById,
	toKebabCase,
	toWorkspaceRelativePath,
} from './utils';

interface ParsedVariant {
	name: string;
	doc?: string;
	commandName?: string;
	subcommandType?: string;
	tupleType?: string;
	source: SourceLocation;
}

interface ParsedEnum {
	name: string;
	variants: ParsedVariant[];
}

interface ParsedStructSubcommand {
	structName: string;
	subcommandEnum: string;
}

function lastTypeSegment(typeRef: string): string {
	const parts = typeRef.split('::');
	return parts[parts.length - 1] ?? typeRef;
}

function findMatchingBrace(text: string, openIndex: number): number {
	let depth = 0;
	let inString = false;
	let stringDelimiter = '';
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
			if (char === stringDelimiter) {
				inString = false;
				stringDelimiter = '';
			}
			continue;
		}

		if (char === '"' || char === '\'') {
			inString = true;
			stringDelimiter = char;
			continue;
		}

		if (char === '{') {
			depth += 1;
			continue;
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

function parseEnumBody(body: string, file: string, enumStartLine: number): ParsedVariant[] {
	const lines = body.split('\n');
	const variants: ParsedVariant[] = [];
	let pendingDocs: string[] = [];
	let pendingAttrs: string[] = [];

	for (let i = 0; i < lines.length; ) {
		const trimmed = lines[i].trim();

		if (trimmed === '') {
			i += 1;
			continue;
		}

		if (trimmed.startsWith('///')) {
			pendingDocs.push(trimmed.replace(/^\/\/\/?\s?/, '').trim());
			i += 1;
			continue;
		}

		if (trimmed.startsWith('#[')) {
			pendingAttrs.push(trimmed);
			i += 1;
			continue;
		}

		if (trimmed.startsWith('//')) {
			i += 1;
			continue;
		}

		const variantMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\b/);
		if (!variantMatch) {
			pendingDocs = [];
			pendingAttrs = [];
			i += 1;
			continue;
		}

		let variantText = lines[i];
		let j = i;
		let depthParen = 0;
		let depthBrace = 0;
		let depthBracket = 0;
		let inString = false;
		let escaping = false;
		let variantClosed = false;

		while (j < lines.length && !variantClosed) {
			const line = lines[j];
			if (j > i) {
				variantText += `\n${line}`;
			}

			for (let charIndex = 0; charIndex < line.length; charIndex++) {
				const char = line[charIndex];

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

				if (char === '(') depthParen += 1;
				if (char === ')') depthParen -= 1;
				if (char === '{') depthBrace += 1;
				if (char === '}') depthBrace -= 1;
				if (char === '[') depthBracket += 1;
				if (char === ']') depthBracket -= 1;

				if (char === ',' && depthParen === 0 && depthBrace === 0 && depthBracket === 0) {
					variantClosed = true;
					break;
				}
			}

			if (!variantClosed) {
				j += 1;
			}
		}

		const attrsText = pendingAttrs.join(' ');
		const name = variantMatch[1];
		const tupleType = variantText.match(/\(\s*([A-Za-z0-9_:]+)\s*\)/)?.[1];
		const subcommandType = variantText.match(
			/#\[command\(subcommand\)\][\s\S]*?\bcommand\s*:\s*([A-Za-z0-9_:]+)\s*,/
		)?.[1];

		variants.push({
			name,
			doc: pendingDocs.length > 0 ? pendingDocs.join(' ') : undefined,
			commandName: attrsText.match(/name\s*=\s*"([^"]+)"/)?.[1],
			subcommandType,
			tupleType,
			source: {
				file,
				line: enumStartLine + i,
			},
		});

		pendingDocs = [];
		pendingAttrs = [];
		i = j + 1;
	}

	return variants;
}

function parseEnumsFromSource(source: string, file: string): ParsedEnum[] {
	const enums: ParsedEnum[] = [];
	const enumRegex = /enum\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/g;

	for (const match of source.matchAll(enumRegex)) {
		const name = match[1];
		const openBraceIndex = (match.index ?? 0) + match[0].lastIndexOf('{');
		const closeBraceIndex = findMatchingBrace(source, openBraceIndex);
		if (closeBraceIndex === -1) {
			continue;
		}

		const body = source.slice(openBraceIndex + 1, closeBraceIndex);
		const enumStartLine = source.slice(0, openBraceIndex).split('\n').length;

		enums.push({
			name,
			variants: parseEnumBody(body, file, enumStartLine),
		});
	}

	return enums;
}

function parseStructSubcommandsFromSource(source: string): ParsedStructSubcommand[] {
	const structs: ParsedStructSubcommand[] = [];
	const structRegex = /struct\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/g;

	for (const match of source.matchAll(structRegex)) {
		const structName = match[1];
		const openBraceIndex = (match.index ?? 0) + match[0].lastIndexOf('{');
		const closeBraceIndex = findMatchingBrace(source, openBraceIndex);
		if (closeBraceIndex === -1) {
			continue;
		}

		const body = source.slice(openBraceIndex + 1, closeBraceIndex);
		const subcommand = body.match(
			/#\[command\(subcommand\)\][\s\S]*?:\s*([A-Za-z0-9_:]+)\s*,/
		)?.[1];
		if (!subcommand) {
			continue;
		}

		structs.push({
			structName,
			subcommandEnum: lastTypeSegment(subcommand),
		});
	}

	return structs;
}

function collectRustFiles(dir: string): string[] {
	const files: string[] = [];
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		const stats = statSync(fullPath);
		if (stats.isDirectory()) {
			files.push(...collectRustFiles(fullPath));
			continue;
		}

		if (entry.endsWith('.rs')) {
			files.push(fullPath);
		}
	}
	return files.sort();
}

function resolveSubcommandEnum(
	variant: ParsedVariant,
	structSubcommandMap: Map<string, string>
): string | null {
	if (variant.subcommandType) {
		return lastTypeSegment(variant.subcommandType);
	}

	if (!variant.tupleType) {
		return null;
	}

	const structName = lastTypeSegment(variant.tupleType);
	return structSubcommandMap.get(structName) ?? null;
}

interface ExtractCliSurfaceOptions {
	workspaceRoot: string;
}

export function extractCliSurface(options: ExtractCliSurfaceOptions): CliSurfaceItem[] {
	const { workspaceRoot } = options;

	const cliMainFile = join(workspaceRoot, 'crates/loom-cli/src/main.rs');
	const spoolLibFile = join(workspaceRoot, 'crates/loom-cli-spool/src/lib.rs');
	const spoolCommandDir = join(workspaceRoot, 'crates/loom-cli-spool/src/commands');
	const wgtunnelCommandDir = join(workspaceRoot, 'crates/loom-cli-wgtunnel/src/commands');

	const sourceFiles = [
		cliMainFile,
		spoolLibFile,
		...collectRustFiles(spoolCommandDir),
		...collectRustFiles(wgtunnelCommandDir),
	];

	const enumMap = new Map<string, ParsedEnum>();
	const structSubcommandMap = new Map<string, string>();

	for (const file of sourceFiles) {
		const source = readText(file);
		const relativeFile = toWorkspaceRelativePath(file, workspaceRoot);

		for (const parsedEnum of parseEnumsFromSource(source, relativeFile)) {
			enumMap.set(parsedEnum.name, parsedEnum);
		}

		for (const parsedStruct of parseStructSubcommandsFromSource(source)) {
			structSubcommandMap.set(parsedStruct.structName, parsedStruct.subcommandEnum);
		}
	}

	const items: CliSurfaceItem[] = [
		{
			id: 'cli:loom',
			domain: 'cli',
			kind: 'command',
			label: 'loom',
			summary: 'Loom CLI root command.',
			command: 'loom',
			parentCommand: null,
			depth: 0,
			source: [
				{
					file: toWorkspaceRelativePath(cliMainFile, workspaceRoot),
					line: 1,
				},
			],
		},
	];

	const visited = new Set<string>();

	function walk(enumName: string, parentTokens: string[]): void {
		const key = `${enumName}:${parentTokens.join(' ')}`;
		if (visited.has(key)) {
			return;
		}
		visited.add(key);

		const parsedEnum = enumMap.get(enumName);
		if (!parsedEnum) {
			return;
		}

		for (const variant of parsedEnum.variants) {
			const token = variant.commandName ?? toKebabCase(variant.name);
			const commandTokens = [...parentTokens, token];
			const command = `loom ${commandTokens.join(' ')}`.trim();
			const parentCommand = parentTokens.length > 0 ? `loom ${parentTokens.join(' ')}` : 'loom';

			items.push({
				id: `cli:${['loom', ...commandTokens].join('.')}`,
				domain: 'cli',
				kind: 'command',
				label: command,
				summary: variant.doc,
				command,
				parentCommand,
				depth: commandTokens.length,
				source: [variant.source],
			});

			const nestedEnumName = resolveSubcommandEnum(variant, structSubcommandMap);
			if (nestedEnumName) {
				walk(nestedEnumName, commandTokens);
			}
		}
	}

	walk('Command', []);

	return stableSortById(dedupeById(items));
}
