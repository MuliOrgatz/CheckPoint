export function getAccessTokenFromLocal(): string | null {
  return localStorage.getItem('accessToken');
}

export function getRefreshTokenFromLocal(): string | null {
  return localStorage.getItem('refreshToken');
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
export function getUserIdFromLocal(): number | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.id ?? null;
  } catch {
    return null;
  }
}
