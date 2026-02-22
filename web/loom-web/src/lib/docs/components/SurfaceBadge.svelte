<!--
 Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 SPDX-License-Identifier: Proprietary
-->
<script lang="ts">
	interface Props {
		text: string;
		tone?: 'neutral' | 'good' | 'warn' | 'danger' | 'info';
	}

	let { text, tone = 'neutral' }: Props = $props();
</script>

<span class={`surface-badge tone-${tone}`}>{text}</span>

<style>
	.surface-badge {
		display: inline-flex;
		align-items: center;
		border-radius: 999px;
		padding: 2px 8px;
		font-size: var(--text-xs);
		font-family: var(--font-mono);
		line-height: 1.4;
		font-weight: 600;
		border: 1px solid var(--color-border);
	}

	.tone-neutral {
		background: var(--color-bg-muted);
		color: var(--color-fg-muted);
	}

	.tone-good {
		background: color-mix(in oklab, var(--color-success) 14%, transparent);
		color: var(--color-success);
	}

	.tone-warn {
		background: color-mix(in oklab, var(--color-warning) 16%, transparent);
		color: var(--color-warning);
	}

	.tone-danger {
		background: color-mix(in oklab, var(--color-error) 14%, transparent);
		color: var(--color-error);
	}

	.tone-info {
		background: color-mix(in oklab, var(--color-info) 14%, transparent);
		color: var(--color-info);
	}
</style>
