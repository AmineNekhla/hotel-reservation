import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';

@Component({
  selector: 'app-reservation-form',
  template: `
    <div class="page-wrapper">
      <div class="container py-4">
        <div class="reservation-container">
          <div class="header">
            <h2>📅 Complete Your Booking</h2>
            <a routerLink="/rooms" class="btn btn-secondary btn-sm">← Back to Rooms</a>
          </div>

          <div *ngIf="room" class="room-summary card">
            <div class="room-summary-image" [style.backgroundImage]="'url(' + room.imageUrl + ')'"></div>
            <div class="room-summary-details">
              <h3>{{ room.type }}</h3>
              <p class="text-muted">Room {{ room.roomNumber }}</p>
              <div class="meta">
                <span>💰 \${{ room.price }}/night</span>
                <span>👤 Up to {{ room.capacity }} guests</span>
              </div>
            </div>
          </div>

          <div *ngIf="!successMsg" class="card form-card">
            <form (ngSubmit)="submit()">
              <div class="form-row">
                <div class="form-group flex-1">
                  <label class="form-label">Check-in Date</label>
                  <input id="start-date" type="date" class="form-control" name="startDate" [(ngModel)]="startDate" required />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Check-out Date</label>
                  <input id="end-date" type="date" class="form-control" name="endDate" [(ngModel)]="endDate" required />
                </div>
              </div>
              <button id="reserve-submit-btn" type="submit" class="btn btn-primary btn-block mt-3" [disabled]="isLoading">
                {{ isLoading ? 'Processing...' : 'Confirm Reservation' }}
              </button>
            </form>
            <div *ngIf="errorMsg" class="error-message mt-3 text-center">
              {{ errorMsg }}
            </div>
          </div>

          <div *ngIf="successMsg" class="success-box card">
            <div class="success-icon">✅</div>
            <h3>Reservation Confirmed!</h3>
            <p>{{ successMsg }}</p>
            <a routerLink="/dashboard" class="btn btn-primary mt-3">View My Bookings</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reservation-container { max-width: 600px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .header h2 { margin: 0; color: var(--primary-color); }
    
    .room-summary {
      display: flex;
      margin-bottom: 2rem;
      overflow: hidden;
    }
    .room-summary-image {
      width: 150px;
      background-size: cover;
      background-position: center;
      background-color: #e2e8f0;
    }
    .room-summary-details {
      padding: 1.5rem;
      flex: 1;
    }
    .room-summary-details h3 { margin: 0 0 0.25rem; }
    .text-muted { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.75rem; }
    .meta { display: flex; gap: 1.5rem; font-weight: 500; font-size: 0.875rem; }
    
    .form-card { padding: 2rem; }
    .form-row { display: flex; gap: 1.5rem; }
    .flex-1 { flex: 1; }
    @media (max-width: 500px) { .form-row { flex-direction: column; gap: 0; } }
    
    .btn-block { width: 100%; padding: 0.875rem; font-size: 1.125rem; }
    .mt-3 { margin-top: 1.5rem; }
    .text-center { text-align: center; }
    
    .success-box {
      padding: 3rem 2rem;
      text-align: center;
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .success-icon { font-size: 4rem; margin-bottom: 1rem; }
    .success-box h3 { color: var(--success-color); }
  `]
})
export class ReservationFormComponent implements OnInit {
  roomId: number = 0;
  room: Room | null = null;
  startDate = '';
  endDate = '';
  successMsg = '';
  errorMsg = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private roomService: RoomService
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
    
    if (!this.startDate || !this.endDate) {
      this.errorMsg = 'Please select both check-in and check-out dates.';
      return;
    }
    if (this.startDate >= this.endDate) {
      this.errorMsg = 'Check-out date must be after check-in date.';
      return;
    }

    this.isLoading = true;
    
    this.reservationService.createReservation({
      roomId: this.roomId,
      startDate: this.startDate,
      endDate: this.endDate
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMsg = 'Your booking has been created successfully. We look forward to your stay!';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.message || 'Failed to create reservation.';
      }
    });
  }
}
