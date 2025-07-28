import { writable } from 'svelte/store';

export interface BreadcrumbContext {
	propertyName?: string;
	listingId?: string;
	[key: string]: any;
}

export const breadcrumbContext = writable<BreadcrumbContext>({});
