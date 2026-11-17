export type AuthUser = {
  username: string;
};

const BASE_URL = '/api/auth';

export const login = async (
  username: string,
  password: string,
): Promise<AuthUser> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  return response.json();
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const response = await fetch(`${BASE_URL}/me`, {
    credentials: 'include',
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return response.json();
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
};
