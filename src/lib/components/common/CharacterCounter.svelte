<script lang="ts">
	/**
	 * CharacterCounter - Textarea with live character count
	 *
	 * Features:
	 * - Shows remaining characters
	 * - Visual warning when approaching limit
	 * - Accessible with proper ARIA labels
	 * - 44px minimum height for touch targets
	 */

	interface Props {
		value: string;
		maxLength: number;
		rows?: number;
		placeholder?: string;
		label: string;
		id: string;
		required?: boolean;
		oninput?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		maxLength,
		rows = 3,
		placeholder = '',
		label,
		id,
		required = false,
		oninput
	}: Props = $props();

	const remaining = $derived(maxLength - value.length);
	const percentUsed = $derived((value.length / maxLength) * 100);

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		oninput?.(value);
	}

	// Color based on usage
	const counterColor = $derived(() => {
		if (percentUsed >= 90) return '#ef4444'; // danger-500
		if (percentUsed >= 75) return '#f59e0b'; // warning-500
		return '#52525b'; // text-secondary
	});
</script>

<div class="character-counter-container">
	<label for={id} class="counter-label">
		{label}
		{#if required}
			<span class="required-mark" aria-label="required">*</span>
		{/if}
	</label>

	<textarea
		{id}
		{rows}
		{placeholder}
		{required}
		maxlength={maxLength}
		bind:value
		oninput={handleInput}
		class="counter-textarea"
		aria-describedby="{id}-count"
	></textarea>

	<div
		id="{id}-count"
		class="counter-text"
		style="color: {counterColor()}"
		aria-live="polite"
	>
		{remaining} characters remaining
	</div>
</div>

<style>
	.character-counter-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.counter-label {
		display: block;
		font-size: 1rem;
		font-weight: 500;
		color: var(--text-primary, #1a1a2e);
	}

	.required-mark {
		color: #ef4444;
		margin-left: 0.25rem;
	}

	.counter-textarea {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		line-height: 1.5;
		border: 2px solid #e4e4e7;
		border-radius: 8px;
		resize: vertical;
		font-family: inherit;
		transition: border-color 0.2s ease;
		min-height: 44px;
	}

	.counter-textarea:focus {
		outline: none;
		border-color: var(--primary-600, #7c3aed);
		box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
	}

	.counter-textarea::placeholder {
		color: #a1a1aa;
	}

	.counter-text {
		font-size: 0.875rem;
		text-align: right;
		transition: color 0.2s ease;
	}

	/* Reduced motion preference */
	@media (prefers-reduced-motion: reduce) {
		.counter-textarea,
		.counter-text {
			transition: none;
		}
	}
</style>
