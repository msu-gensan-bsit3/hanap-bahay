import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
		.split(' ')
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(' ');
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
