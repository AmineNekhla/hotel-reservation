import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';

@Component({
  selector: 'app-reservation-form',
  template: `
    <div class="container">
      <div class="header">
        <h2>📅 Make a Reservation</h2>
        <a routerLink="/rooms">← Back to Rooms</a>
      </div>

      <div *ngIf="room" class="room-info">
        <h3>Room: {{ room.type }}</h3>
        <p>Price: \${{ room.price }}/night | Capacity: {{ room.capacity }} person(s)</p>
      </div>

      <div *ngIf="!successMsg">
        <form (ngSubmit)="submit()">
          <div class="form-group">
            <label>Check-in Date</label>
            <input id="start-date" type="date" name="startDate" [(ngModel)]="startDate" required />
          </div>
          <div class="form-group">
            <label>Check-out Date</label>
            <input id="end-date" type="date" name="endDate" [(ngModel)]="endDate" required />
          </div>
          <button id="reserve-submit-btn" type="submit">Confirm Reservation</button>
        </form>
        <p *ngIf="errorMsg" class="error">{{ errorMsg }}</p>
      </div>

      <div *ngIf="successMsg" class="success-box">
        <p>✅ {{ successMsg }}</p>
        <a routerLink="/dashboard">View My Reservations</a>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 500px; margin: 60px auto; padding: 30px; border: 1px solid #ddd; border-radius: 8px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .header h2 { margin: 0; }
    .header a { color: #007bff; text-decoration: none; }
    .room-info { background: #f0f8ff; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
    .room-info h3 { margin: 0 0 5px; }
    .room-info p { margin: 0; color: #555; }
    .form-group { margin-bottom: 15px; display: flex; flex-direction: column; }
    label { margin-bottom: 5px; font-weight: bold; }
    input { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
    button { width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
    button:hover { background: #1e7e34; }
    .success-box { background: #d4edda; padding: 20px; border-radius: 6px; text-align: center; }
    .success-box a { display: block; margin-top: 10px; color: #007bff; }
    .error { color: red; }
  `]
})
export class ReservationFormComponent implements OnInit {
  roomId: number = 0;
  room: Room | null = null;
  startDate = '';
  endDate = '';
  successMsg = '';
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private roomService: RoomService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.roomId = +params['roomId'];
      if (this.roomId) {
        this.roomService.getRoomById(this.roomId).subscribe({
          next: (room) => this.room = room,
          error: () => this.errorMsg = 'Room not found.'
        });
      }
    });
  }

  submit() {
    this.errorMsg = '';
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.errorMsg = 'You must be logged in to make a reservation.';
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.errorMsg = 'Please select both check-in and check-out dates.';
      return;
    }
    if (this.startDate >= this.endDate) {
      this.errorMsg = 'Check-out date must be after check-in date.';
      return;
    }

    this.reservationService.createReservation({
      userId: currentUser.id,
      roomId: this.roomId,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe({
      next: () => {
        this.successMsg = 'Reservation confirmed successfully!';
      },
      error: (err) => {
        this.errorMsg = err.error || 'Failed to create reservation.';
      }
    });
  }
}
