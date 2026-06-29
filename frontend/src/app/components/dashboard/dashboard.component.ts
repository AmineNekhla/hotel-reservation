import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-header">
      <div class="container">
        <h1>My Bookings</h1>
        <p>Manage your upcoming and past reservations</p>
      </div>
    </div>

    <div class="container py-4">
      <div *ngIf="loading" class="text-center py-4">
        <p>Loading your reservations...</p>
      </div>
      
      <div *ngIf="errorMsg" class="error-message text-center py-4">
        {{ errorMsg }}
      </div>

      <div *ngIf="!loading && reservations.length === 0" class="text-center py-4 card p-5">
        <h3>No reservations found</h3>
        <p class="text-muted mt-2">You haven't booked any rooms yet.</p>
        <a routerLink="/rooms" class="btn btn-primary mt-3">Browse Rooms</a>
      </div>

      <div class="booking-list" *ngIf="!loading && reservations.length > 0">
        <div class="card booking-card" *ngFor="let r of reservations">
          <div class="booking-image" [style.backgroundImage]="'url(' + r.room.imageUrl + ')'"></div>
          
          <div class="booking-details">
            <div class="booking-header">
              <h3>{{ r.room.type }} <span class="text-muted text-sm">Room {{ r.room.roomNumber }}</span></h3>
              <span class="badge" [ngClass]="{
                'badge-warning': r.status === 'PENDING',
                'badge-success': r.status === 'CONFIRMED',
                'badge-error': r.status === 'CANCELLED'
              }">{{ r.status }}</span>
            </div>
            
            <div class="booking-dates mt-3">
              <div class="date-box">
                <span class="text-muted text-sm">Check-in</span>
                <strong>{{ r.startDate | date:'mediumDate' }}</strong>
              </div>
              <div class="date-arrow">→</div>
              <div class="date-box">
                <span class="text-muted text-sm">Check-out</span>
                <strong>{{ r.endDate | date:'mediumDate' }}</strong>
              </div>
            </div>
            
            <div class="booking-footer mt-3">
              <span class="text-muted text-sm">Booked on {{ r.createdAt | date:'mediumDate' }}</span>
              <button *ngIf="r.status !== 'CANCELLED'" 
                      (click)="cancelReservation(r.id!)" 
                      class="btn btn-secondary btn-sm"
                      [disabled]="cancelLoading === r.id">
                {{ cancelLoading === r.id ? 'Cancelling...' : 'Cancel Booking' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      background-color: var(--primary-color);
      color: white;
      padding: 3rem 0;
      margin-bottom: 2rem;
      text-align: center;
    }
    .page-header h1 {
      color: white;
      margin-bottom: 0.5rem;
    }
    .page-header p {
      opacity: 0.8;
      font-size: 1.125rem;
    }
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
    .p-5 { padding: 3rem; }
    .text-center { text-align: center; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-3 { margin-top: 1rem; }
    .text-muted { color: var(--text-secondary); }
    .text-sm { font-size: 0.875rem; }
    
    .booking-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .booking-card {
      display: flex;
      overflow: hidden;
    }
    
    .booking-image {
      width: 200px;
      background-size: cover;
      background-position: center;
      background-color: #e2e8f0;
    }
    
    .booking-details {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .booking-header h3 {
      margin: 0;
      color: var(--primary-color);
    }
    
    .booking-dates {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: var(--background-color);
      padding: 1rem;
      border-radius: var(--radius-md);
    }
    
    .date-box {
      display: flex;
      flex-direction: column;
    }
    
    .date-arrow {
      color: var(--text-secondary);
      font-weight: bold;
    }
    
    .booking-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 1rem;
    }
    
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
    }
    .badge-warning { background-color: var(--warning-color); }
    .badge-success { background-color: var(--success-color); }
    .badge-error { background-color: var(--danger-color); }
    
    @media (max-width: 600px) {
      .booking-card { flex-direction: column; }
      .booking-image { width: 100%; height: 150px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;
  errorMsg = '';
  cancelLoading: number | null = null;

  constructor(private reservationService: ReservationService) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.reservationService.getMyReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to load reservations.';
        this.loading = false;
      }
    });
  }

  cancelReservation(id: number) {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    
    this.cancelLoading = id;
    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.cancelLoading = null;
        this.loadReservations(); // reload to get updated status
      },
      error: (err) => {
        this.cancelLoading = null;
        alert('Failed to cancel: ' + (err.message || 'Unknown error'));
      }
    });
  }
}
