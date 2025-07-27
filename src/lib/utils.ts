import { clsx, type ClassValue } from "clsx";
import { onMount } from "svelte";
import { twMerge } from "tailwind-merge";

export type MakeOptional<T, TOptional extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, TOptional>
> &
	Partial<Pick<T, TOptional>>;

export function omit<T extends object, K extends keyof T>(object: T, ...keys: K[]): Omit<T, K> {
	const entries = Object.entries(object).filter(([key]) => !keys.includes(key as K));
	return Object.fromEntries(entries) as Omit<T, K>;
}

/** n days in ms */
export const days = (n: number) => 1000 * 60 * 60 * 24 * n;

export function toTitleCase(str: string): string {
	return str
		.toLowerCase()
		.split(/[-\s]+/)
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function formatPrice(num: number, useCompactNotation: boolean = true): string {
	if (useCompactNotation) {
		return (
			'₱' +
			new Intl.NumberFormat('en-US', {
				notation: 'compact',
				compactDisplay: 'short',
			}).format(num)
		);
	} else {
		return (
			'₱' +
			new Intl.NumberFormat('en-US', {
				useGrouping: true,
			}).format(num)
		);
	}
}

export function hideFooter() {
	onMount(() => {
		const footer = document.querySelector("footer");

		if (footer) {
			// footer.style.setProperty("display", "none");
			footer.style.display = "none";
		}
		return () => {
			if (footer) {
				footer.style.display = "block";
			}
		};
	});
}

export function formatTimeAgo(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffMins < 1) return "now";
	if (diffMins < 60) return `${diffMins} min ago`;
	if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
	return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}
