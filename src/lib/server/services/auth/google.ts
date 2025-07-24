import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import { Google } from 'arctic';

if ((!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CALLBACK) && !building) {
	throw 'env GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET should be defined';
}

export const google = new Google(
	env.GOOGLE_CLIENT_ID!,
	env.GOOGLE_CLIENT_SECRET!,
	env.GOOGLE_CALLBACK!
);
