import axios from 'axios';
import { getRefreshTokenFromLocal } from '../utils/authHelpers';
import { POST_LOGIN, POST_REFRESH_TOKEN, POST_REGISTER } from './endpoints';
import type { LoginResponse, RegisterPayload } from '../models/Auth';
import config from '../environment';

const BASE_URL = config.userApiUrl;

export async function login(username: string, password: string): Promise<void> {
  try {
    const url = `${BASE_URL}/${POST_LOGIN}`;
    const response = await axios.post<LoginResponse>(url, {
      username,
      password,
    });

    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    // Use AxiosError type for better type safety
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      throw new Error(error.response.data.message);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while logging in');
  }
}

export async function refreshToken(): Promise<string> {
  const url = `${BASE_URL}/${POST_REFRESH_TOKEN}`;
  const refreshToken = getRefreshTokenFromLocal();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(url, { refreshToken });
    const { accessToken } = response.data;

    localStorage.setItem('accessToken', accessToken);

    return accessToken;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while refreshing token');
  }
}

export async function register(payload: RegisterPayload): Promise<void> {
  try {
    const url = `${BASE_URL}/${POST_REGISTER}`;
    const response = await axios.post<LoginResponse>(url, payload);

    const { accessToken, refreshToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while logging in');
  }
}
