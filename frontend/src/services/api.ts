import axios, { type AxiosResponse } from 'axios';
import config from '../environment';
import { getAccessTokenFromLocal, isTokenExpired } from '../utils/authHelpers';
import { refreshToken } from './auth.service';

const BASE_URL = config.bookingApiUrl;

async function getAccessToken(): Promise<string> {
  let accessToken = getAccessTokenFromLocal();

  if (!accessToken || isTokenExpired(accessToken)) {
    try {
      accessToken = await refreshToken();
    } catch (error) {
      console.error('Failed to refresh access token', error);
      throw new Error('Failed to get access token');
    }
  }

  return accessToken;
}

// Generic GET function with typed params
export async function get<T, P extends object = Record<string, unknown>>(
  endpoint: string,
  params?: P
): Promise<T> {
  const url = `${BASE_URL}/${endpoint}`;
  console.log(`Fetching data from url: ${url} with params:`, params);

  try {
    const token = await getAccessToken();
    const response: AxiosResponse<T> = await axios.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error(`Failed to fetch data from: ${url}`, error);

    if (error instanceof Error) {
      throw new Error(`Failed to fetch data from ${url}: ${error.message}`);
    }

    throw new Error('Failed to fetch data from API');
  }
}

// Generic POST function with typed request body
export async function post<T, D extends object = Record<string, unknown>>(
  endpoint: string,
  data?: D
): Promise<T> {
  const url = `${BASE_URL}/${endpoint}`;
  console.log(`Adding data at url: ${url} with data:`, data);

  try {
    const token = await getAccessToken();
    const response: AxiosResponse<T> = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const backendMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      console.error(`Failed to add data at: ${url}`, backendMsg);
      throw new Error(backendMsg);
    }
    throw new Error('An unknown error occurred while making the POST request.');
  }
}
