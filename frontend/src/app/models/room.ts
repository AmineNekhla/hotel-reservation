export interface Room {
  id?: number;
  roomNumber: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  availability: boolean;
  imageUrl: string;
}
