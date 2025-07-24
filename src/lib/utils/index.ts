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
