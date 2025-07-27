import { redirect, type RequestHandler } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/services/auth';

export const POST: RequestHandler = async (event) => {
  const sessionToken = event.cookies.get('auth-session');
  
  if (sessionToken) {
    await invalidateSession(sessionToken);
  }
  
  deleteSessionTokenCookie(event);
  
  throw redirect(302, '/login');
};
