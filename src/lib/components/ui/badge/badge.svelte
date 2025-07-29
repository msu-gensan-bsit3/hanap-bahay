<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent",
				secondary:
					"bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent",
				destructive:
					"bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 border-transparent text-white",
				outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

				// Tag Variants

				"sale":
					"bg-green-500 text-white [a&]:hover:bg-red-600 border-transparent",
				"rent":
					"bg-orange-500 text-white [a&]:hover:bg-green-600 border-transparent",
				"lease":
					"bg-yellow-500 text-white [a&]:hover:bg-yellow-600 border-transparent",
				
				// Category Variants
				"category":
					"bg-blue-100 text-blue-800 border-blue-200 [a&]:hover:bg-blue-200",
				"category-house":
					"bg-purple-100 text-purple-800 border-purple-200 [a&]:hover:bg-purple-200",
				"category-condo":
					"bg-indigo-100 text-indigo-800 border-indigo-200 [a&]:hover:bg-indigo-200",
				"category-lot":
					"bg-emerald-100 text-emerald-800 border-emerald-200 [a&]:hover:bg-emerald-200",
				"category-commercial":
					"bg-orange-100 text-orange-800 border-orange-200 [a&]:hover:bg-orange-200",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
