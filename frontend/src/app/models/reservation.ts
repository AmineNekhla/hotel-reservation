import { User } from './user';
import { Room } from './room';

export interface Reservation {
  id?: number;
  user: User;
  room: Room;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}
