import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-header" style="padding: 3rem 0;">
      <div class="container">
        <h1 style="font-size: 2rem;">My Trips</h1>
        <p>Manage your upcoming and past reservations</p>
      </div>
    </div>

    <div class="container py-5">
      <app-loading-spinner [loading]="loading"></app-loading-spinner>
      
      <div *ngIf="errorMsg" class="error-message text-center py-4">
        {{ errorMsg }}
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && reservations.length === 0" class="empty-state card text-center py-5">
        <div class="empty-icon slide-up">🧳</div>
        <h3 class="slide-up delay-1">No trips booked... yet!</h3>
        <p class="text-muted mt-2 mb-4 slide-up delay-2">Time to dust off your bags and start planning your next great adventure.</p>
        <a routerLink="/rooms" class="btn btn-primary btn-lg slide-up delay-3">Start Exploring</a>
      </div>

      <!-- Booking List -->
      <div class="booking-list" *ngIf="!loading && reservations.length > 0">
        <div class="card booking-card" *ngFor="let r of reservations">
          <div class="booking-image" [style.backgroundImage]="'url(' + r.room.imageUrl + ')'"></div>
          
          <div class="booking-details">
            <div class="booking-header mb-3">
              <div>
                <h3 class="mb-1">{{ r.room.type }}</h3>
                <p class="text-muted text-sm"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> LuxeStay Signature Collection &bull; Room {{ r.room.roomNumber }}</p>
              </div>
              <span class="badge" [ngClass]="{
                'badge-warning': r.status === 'PENDING',
                'badge-success': r.status === 'CONFIRMED',
                'badge-error': r.status === 'CANCELLED'
              }">{{ r.status }}</span>
            </div>
            
            <div class="booking-info-grid">
              <div class="info-item">
                <span class="text-muted text-xs uppercase font-bold tracking-wide">Check-in</span>
                <strong>{{ r.startDate | date:'MMM d, y' }}</strong>
              </div>
              <div class="info-item">
                <span class="text-muted text-xs uppercase font-bold tracking-wide">Check-out</span>
                <strong>{{ r.endDate | date:'MMM d, y' }}</strong>
              </div>
              <div class="info-item">
                <span class="text-muted text-xs uppercase font-bold tracking-wide">Total Cost</span>
                <strong class="text-primary">\${{ calculateTotal(r) }}</strong>
              </div>
            </div>
            
            <div class="booking-footer mt-4 pt-3" style="border-top: 1px solid var(--border-color);">
              <span class="text-muted text-sm">Booked on {{ r.createdAt | date:'MMM d, y' }}</span>
              <button *ngIf="r.status !== 'CANCELLED'" 
                      (click)="cancelReservation(r.id!)" 
                      class="btn btn-outline btn-sm btn-danger"
                      [disabled]="cancelLoading === r.id">
                <span *ngIf="cancelLoading !== r.id">Cancel Reservation</span>
                <span *ngIf="cancelLoading === r.id">Cancelling...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .py-5 { padding-top: 3rem; padding-bottom: 3rem; }
    .text-center { text-align: center; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-4 { margin-top: 1.5rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-3 { margin-bottom: 1rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .pt-3 { padding-top: 1rem; }
    
    .text-muted { color: var(--text-secondary); }
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .text-primary { color: var(--primary-color); }
    .font-bold { font-weight: 700; }
    .tracking-wide { letter-spacing: 0.05em; }
    .uppercase { text-transform: uppercase; }
    
    .empty-state { max-width: 600px; margin: 0 auto; padding: 4rem 2rem; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    
    .booking-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .booking-card {
      display: flex;
      overflow: hidden;
      transition: all var(--transition-normal);
    }
    .booking-card:hover {
      box-shadow: var(--shadow-lg);
    }
    
    .booking-image {
      width: 250px;
      background-size: cover;
      background-position: center;
      background-color: #e2e8f0;
    }
    
    .booking-details {
      padding: 1.5rem 2rem;
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
      font-size: 1.25rem;
    }
    
    .booking-info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      background: var(--background-color);
      padding: 1rem 1.5rem;
      border-radius: var(--radius-md);
      align-items: center;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    
    .booking-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
    
    /* Animations */
    .slide-up { opacity: 0; transform: translateY(20px); animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    
    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }
    
    @media (max-width: 768px) {
      .booking-card { flex-direction: column; }
      .booking-image { width: 100%; height: 200px; }
      .booking-info-grid { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;
  errorMsg = '';
  cancelLoading: number | null = null;

  constructor(
    private reservationService: ReservationService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.reservationService.getMyReservations().subscribe({
      next: (data) => {
        // Sort reservations by date descending (newest first)
        this.reservations = data.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load reservations.';
        this.toast.showError(this.errorMsg);
        this.loading = false;
      }
    });
  }

  calculateTotal(reservation: Reservation): number {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays * reservation.room.price : reservation.room.price;
  }

  cancelReservation(id: number) {
    if (!confirm('Are you sure you want to cancel this reservation? This action cannot be undone.')) return;
    
    this.cancelLoading = id;
    this.reservationService.cancelReservation(id).subscribe({
      next: () => {
        this.cancelLoading = null;
        this.toast.showSuccess('Reservation successfully cancelled.');
        this.loadReservations();
      },
      error: (err) => {
        this.cancelLoading = null;
        this.toast.showError('Failed to cancel: ' + (err.message || 'Unknown error'));
      }
    });
  }
}
