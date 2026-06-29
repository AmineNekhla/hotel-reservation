export interface Reservation {
  id?: number;
  userId?: number;
  roomId?: number;
  startDate: string;
  endDate: string;
  status?: string;
  user?: any;
  room?: any;
}
