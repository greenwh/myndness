<script lang="ts">
	/**
	 * ExposureChart - Line chart showing distress over exposure attempts
	 *
	 * Features:
	 * - Three lines: distressBefore, distressDuring, distressAfter
	 * - Target distress line (dashed horizontal)
	 * - Chart.js visualization
	 * - Shows habituation trend over time
	 */

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { ExposureAttempt } from '$lib/db/types';
	import { Chart, registerables } from 'chart.js';

	interface Props {
		exposureAttempts: ExposureAttempt[];
		targetDistress?: number;
	}

	let { exposureAttempts, targetDistress }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;
	let chartContainer: HTMLDivElement;

	// Format date for display
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}

	// Create or update chart
	function createChart() {
		if (!browser || !canvas) return;

		// Destroy existing chart
		if (chart) {
			chart.destroy();
			chart = null;
		}

		// No data, don't create chart
		if (exposureAttempts.length === 0) return;

		// Register Chart.js components
		Chart.register(...registerables);

		// Prepare data
		const labels = exposureAttempts.map((e) => formatDate(e.date));
		const beforeData = exposureAttempts.map((e) => e.distressBefore);
		const duringData = exposureAttempts.map((e) => e.distressDuring);
		const afterData = exposureAttempts.map((e) => e.distressAfter);

		// Create datasets
		const datasets: any[] = [
			{
				label: 'Before',
				data: beforeData,
				borderColor: '#3b82f6',
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				borderWidth: 2,
				tension: 0.1,
				pointRadius: 4,
				pointHoverRadius: 6
			},
			{
				label: 'During (Peak)',
				data: duringData,
				borderColor: '#f59e0b',
				backgroundColor: 'rgba(245, 158, 11, 0.1)',
				borderWidth: 2,
				tension: 0.1,
				pointRadius: 4,
				pointHoverRadius: 6
			},
			{
				label: 'After',
				data: afterData,
				borderColor: '#10b981',
				backgroundColor: 'rgba(16, 185, 129, 0.1)',
				borderWidth: 2,
				tension: 0.1,
				pointRadius: 4,
				pointHoverRadius: 6
			}
		];

		// Add target line if specified
		if (targetDistress !== undefined) {
			datasets.push({
				label: 'Target',
				data: Array(exposureAttempts.length).fill(targetDistress),
				borderColor: '#6b7280',
				backgroundColor: 'rgba(107, 116, 128, 0.1)',
				borderWidth: 2,
				borderDash: [5, 5],
				pointRadius: 0,
				pointHoverRadius: 0
			});
		}

		// Create chart
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: 'index',
					intersect: false
				},
				scales: {
					y: {
						min: 0,
						max: 100,
						title: {
							display: true,
							text: 'SUDS Rating',
							font: {
								size: 14,
								weight: '600'
							}
						},
						ticks: {
							stepSize: 20,
							callback: function (value) {
								return value;
							}
						},
						grid: {
							color: '#e4e4e7'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Exposure Date',
							font: {
								size: 14,
								weight: '600'
							}
						},
						grid: {
							display: false
						}
					}
				},
				plugins: {
					legend: {
						display: true,
						position: 'top',
						labels: {
							usePointStyle: true,
							padding: 15,
							font: {
								size: 12,
								weight: '500'
							}
						}
					},
					tooltip: {
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						padding: 12,
						cornerRadius: 8,
						titleFont: {
							size: 14,
							weight: '600'
						},
						bodyFont: {
							size: 13
						},
						bodySpacing: 6,
						callbacks: {
							label: function (context) {
								let label = context.dataset.label || '';
								if (label) {
									label += ': ';
								}
								if (context.parsed.y !== null) {
									label += context.parsed.y + ' SUDS';
								}
								return label;
							}
						}
					}
				}
			}
		});
	}

	// Mount and update
	onMount(() => {
		if (browser) {
			createChart();
		}
	});

	// Recreate chart when data changes
	$effect(() => {
		// Access reactive props to trigger effect
		exposureAttempts;
		targetDistress;

		if (browser && canvas) {
			createChart();
		}
	});

	// Cleanup
	onDestroy(() => {
		if (chart) {
			chart.destroy();
			chart = null;
		}
	});
</script>

<div class="chart-container" bind:this={chartContainer}>
	{#if exposureAttempts.length === 0}
		<!-- Empty state -->
		<div class="empty-state">
			<div class="empty-icon">📈</div>
			<h4 class="empty-title">No Exposure Data Yet</h4>
			<p class="empty-description">
				Log your first exposure to see your progress chart. The chart will show how your distress
				changes over time.
			</p>
		</div>
	{:else}
		<!-- Chart -->
		<div class="chart-wrapper">
			<canvas bind:this={canvas}></canvas>
		</div>

		<!-- Legend explanation -->
		<div class="chart-info">
			<div class="info-item">
				<div class="info-dot blue"></div>
				<span><strong>Before:</strong> Anxiety before starting exposure</span>
			</div>
			<div class="info-item">
				<div class="info-dot amber"></div>
				<span><strong>During:</strong> Peak anxiety during exposure</span>
			</div>
			<div class="info-item">
				<div class="info-dot green"></div>
				<span><strong>After:</strong> Anxiety after completing exposure</span>
			</div>
			{#if targetDistress !== undefined}
				<div class="info-item">
					<div class="info-dot gray dashed"></div>
					<span><strong>Target:</strong> Your goal distress level</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.chart-container {
		width: 100%;
		background: white;
		border: 2px solid #e4e4e7;
		border-radius: 12px;
		padding: 1.5rem;
	}

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 3rem 1rem;
		text-align: center;
		gap: 1rem;
	}

	.empty-icon {
		font-size: 3rem;
		line-height: 1;
	}

	.empty-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #1a1a2e;
		margin: 0;
	}

	.empty-description {
		font-size: 0.875rem;
		color: #52525b;
		max-width: 400px;
		line-height: 1.6;
		margin: 0;
	}

	/* Chart wrapper */
	.chart-wrapper {
		position: relative;
		width: 100%;
		height: 300px;
		margin-bottom: 1rem;
	}

	/* Chart info */
	.chart-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 1rem;
		border-top: 1px solid #e4e4e7;
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
		color: #52525b;
	}

	.info-dot {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.info-dot.blue {
		background: #3b82f6;
	}

	.info-dot.amber {
		background: #f59e0b;
	}

	.info-dot.green {
		background: #10b981;
	}

	.info-dot.gray {
		background: #6b7280;
	}

	.info-dot.dashed {
		background: linear-gradient(
			to right,
			#6b7280 50%,
			transparent 50%
		);
		background-size: 8px 2px;
		background-repeat: repeat-x;
		background-position: center;
		border-radius: 0;
		height: 2px;
	}

	.info-item strong {
		font-weight: 600;
		color: #1a1a2e;
	}

	/* Mobile adjustments */
	@media (max-width: 640px) {
		.chart-container {
			padding: 1rem;
		}

		.chart-wrapper {
			height: 250px;
		}

		.chart-info {
			font-size: 0.8125rem;
		}
	}
</style>
