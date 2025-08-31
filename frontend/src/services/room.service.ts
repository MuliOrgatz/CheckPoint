import type { RoomResponse } from '../models/Room';
import { get } from './api';
import { GET_SEARCH_ROOMS } from './endpoints';

export async function fetchRooms(params?: {
  limit?: number;
  offset?: number;
}): Promise<RoomResponse> {
  return await get<RoomResponse>(GET_SEARCH_ROOMS, params);
}
