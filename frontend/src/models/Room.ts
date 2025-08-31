export interface Room {
  id: number;
  name: string;
  location: string;
  pricePerNight: number;
}

export interface RoomResponse {
  rooms: Room[];
  total: number;
}
