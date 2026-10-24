import { SESSION_COOKIE_NAME, readSessionCookie } from './auth.constants';

describe('readSessionCookie', () => {
  it('returns null when there is no Cookie header', () => {
    expect(readSessionCookie(undefined)).toBeNull();
    expect(readSessionCookie('')).toBeNull();
  });

  it('returns null when the session cookie is not among the cookies', () => {
    expect(readSessionCookie('theme=dark; lang=en')).toBeNull();
  });

  it('finds the session cookie among several cookies', () => {
    const header = `theme=dark; ${SESSION_COOKIE_NAME}=abc.def; lang=en`;
    expect(readSessionCookie(header)).toBe('abc.def');
  });

  it('does not mistake a cookie that merely ends in "session" for ours', () => {
    expect(readSessionCookie('mysession=evil')).toBeNull();
  });

  it('decodes URL-encoded values', () => {
    expect(readSessionCookie(`${SESSION_COOKIE_NAME}=a%20b`)).toBe('a b');
  });

  it('returns null instead of crashing on broken encoding', () => {
    expect(readSessionCookie(`${SESSION_COOKIE_NAME}=%E0%A4%A`)).toBeNull();
  });
});
