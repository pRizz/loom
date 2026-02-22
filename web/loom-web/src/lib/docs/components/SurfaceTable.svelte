<!--
 Copyright (c) 2025 Geoffrey Huntley <ghuntley@ghuntley.com>. All rights reserved.
 SPDX-License-Identifier: Proprietary
-->
<script lang="ts">
	import SurfaceBadge from './SurfaceBadge.svelte';

	type Maturity = 'stable' | 'beta' | 'experimental' | 'internal';

	interface SurfaceTableRow {
		id: string;
		label: string;
		summary?: string;
		method?: string;
		path?: string;
		audience: string;
		maturity: Maturity;
		authScope: string;
		primaryDocsPath: string;
	}

	interface Props {
		title?: string;
		rows: SurfaceTableRow[];
	}

	let { title, rows }: Props = $props();

	function maturityTone(maturity: Maturity): 'good' | 'info' | 'warn' | 'danger' {
		switch (maturity) {
			case 'stable':
				return 'good';
			case 'beta':
				return 'info';
			case 'experimental':
				return 'warn';
			case 'internal':
				return 'danger';
			default:
				return 'info';
		}
	}
</script>

{#if title}
	<h2>{title}</h2>
{/if}

<div class="surface-table-wrap">
	<table class="surface-table">
		<thead>
			<tr>
				<th>Surface</th>
				<th>Identifier</th>
				<th>Scope</th>
				<th>Maturity</th>
				<th>Docs</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row}
				<tr>
					<td>
						<div class="surface-label">{row.label}</div>
						{#if row.method || row.path}
							<div class="surface-meta">
								{#if row.method}
									<code>{row.method}</code>
								{/if}
								{#if row.path}
									<code>{row.path}</code>
								{/if}
							</div>
						{/if}
						{#if row.summary}
							<div class="surface-summary">{row.summary}</div>
						{/if}
					</td>
					<td>
						<code>{row.id}</code>
					</td>
					<td>
						<div class="scope-pills">
							<SurfaceBadge text={row.audience} tone="neutral" />
							<SurfaceBadge text={row.authScope} tone="neutral" />
						</div>
					</td>
					<td>
						<SurfaceBadge text={row.maturity} tone={maturityTone(row.maturity)} />
					</td>
					<td>
						<a href={row.primaryDocsPath}><code>{row.primaryDocsPath}</code></a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	h2 {
		margin-top: var(--space-8);
	}

	.surface-table-wrap {
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.surface-table {
		width: 100%;
		min-width: 820px;
		border-collapse: collapse;
		font-family: var(--font-mono);
		font-size: var(--text-sm);
	}

	.surface-table th,
	.surface-table td {
		padding: var(--space-3);
		border-bottom: 1px solid var(--color-border);
		vertical-align: top;
		text-align: left;
	}

	.surface-table thead th {
		background: var(--color-bg-muted);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.surface-table tbody tr:last-child td {
		border-bottom: none;
	}

	.surface-label {
		font-weight: 600;
		color: var(--color-fg);
	}

	.surface-meta {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-top: var(--space-1);
	}

	.surface-summary {
		margin-top: var(--space-1);
		color: var(--color-fg-muted);
		line-height: 1.4;
	}

	.scope-pills {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	a {
		color: var(--color-accent);
	}
</style>
