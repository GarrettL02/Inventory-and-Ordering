export const SESSION_COOKIE_NAME = 'session';

// Pull the session token out of a raw Cookie header
export function readSessionCookie(cookieHeader?: string): string | null {
  const prefix = `${SESSION_COOKIE_NAME}=`;
  const cookie = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  if (!cookie) {
    return null;
  }

  try {
    return decodeURIComponent(cookie.slice(prefix.length));
  } catch {
    return null;
  }
}
