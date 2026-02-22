// Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
// SPDX-License-Identifier: Proprietary

import { join } from 'path';

import type { VsCodeSurfaceItem } from './types';
import {
	dedupeById,
	lineNumberAtOffset,
	readText,
	stableSortById,
	toWorkspaceRelativePath,
} from './utils';

interface VsCodePackageManifest {
	contributes?: {
		commands?: Array<{ command: string; title: string; category?: string }>;
		configuration?: {
			properties?: Record<
				string,
				{
					type?: string | string[];
					default?: unknown;
					description?: string;
				}
			>;
		};
		keybindings?: Array<{ command: string; key?: string; mac?: string }>;
	};
}

interface ExtractVsCodeSurfaceOptions {
	workspaceRoot: string;
}

export function extractVsCodeSurface(options: ExtractVsCodeSurfaceOptions): VsCodeSurfaceItem[] {
	const { workspaceRoot } = options;
	const packageJsonFile = join(workspaceRoot, 'ide/vscode/package.json');
	const raw = readText(packageJsonFile);
	const manifest = JSON.parse(raw) as VsCodePackageManifest;
	const relativeFile = toWorkspaceRelativePath(packageJsonFile, workspaceRoot);

	const keybindingMap = new Map<string, string>();
	for (const binding of manifest.contributes?.keybindings ?? []) {
		if (!binding.command) {
			continue;
		}
		const keyString = [binding.key, binding.mac].filter(Boolean).join(' | ');
		if (keyString !== '') {
			keybindingMap.set(binding.command, keyString);
		}
	}

	const items: VsCodeSurfaceItem[] = [];

	for (const command of manifest.contributes?.commands ?? []) {
		if (!command.command) {
			continue;
		}
		const line = lineNumberAtOffset(raw, raw.indexOf(command.command));
		items.push({
			id: `vscode:command:${command.command}`,
			domain: 'vscode',
			kind: 'command',
			label: command.title,
			summary: command.category ? `${command.category} command` : 'VS Code command',
			commandId: command.command,
			title: command.title,
			category: command.category,
			keybinding: keybindingMap.get(command.command),
			source: [
				{
					file: relativeFile,
					line,
				},
			],
		});
	}

	for (const [settingKey, definition] of Object.entries(
		manifest.contributes?.configuration?.properties ?? {}
	)) {
		const typeValue = definition.type;
		const settingType = Array.isArray(typeValue)
			? typeValue.join(' | ')
			: (typeValue ?? 'unknown');
		const line = lineNumberAtOffset(raw, raw.indexOf(settingKey));

		items.push({
			id: `vscode:setting:${settingKey}`,
			domain: 'vscode',
			kind: 'setting',
			label: settingKey,
			summary: definition.description,
			settingKey,
			settingType,
			defaultValue: definition.default,
			source: [
				{
					file: relativeFile,
					line,
				},
			],
		});
	}

	return stableSortById(dedupeById(items));
}
