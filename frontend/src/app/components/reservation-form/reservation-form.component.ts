import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reservation-form',
  template: `
    <div class="page-wrapper">
      <div class="page-header" style="padding: 3rem 0;">
        <div class="container">
          <h1 style="font-size: 2rem;">Complete Your Booking</h1>
          <p>You're almost there! Review your details below.</p>
        </div>
      </div>

      <div class="container py-5">
        <app-loading-spinner [loading]="!room && !errorMsg"></app-loading-spinner>
        
        <div *ngIf="errorMsg && !room" class="error-state text-center py-5">
          <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
          <h3>Room Not Found</h3>
          <p class="text-muted">{{ errorMsg }}</p>
          <a routerLink="/rooms" class="btn btn-primary mt-3">Back to Rooms</a>
        </div>

        <div class="checkout-layout" *ngIf="room">
          
          <!-- Success State -->
          <div *ngIf="successMsg" class="success-box card" style="grid-column: 1 / -1;">
            <div class="success-icon slide-up">🎉</div>
            <h2 class="slide-up delay-1 text-primary">Booking Confirmed!</h2>
            <p class="slide-up delay-2 text-muted mb-4">{{ successMsg }}</p>
            <div class="slide-up delay-3">
              <a routerLink="/dashboard" class="btn btn-primary">View My Trips</a>
              <a routerLink="/rooms" class="btn btn-outline ml-2">Browse More Rooms</a>
            </div>
          </div>

          <!-- Form Area -->
          <div class="checkout-form" *ngIf="!successMsg">
            <div class="card p-4">
              <h3 class="mb-4">Select Dates</h3>
              <form (ngSubmit)="submit()">
                <div class="form-row">
                  <div class="form-group flex-1">
                    <label class="form-label">Check-in Date</label>
                    <input id="start-date" type="date" class="form-control" [class.is-invalid]="validationError" name="startDate" [(ngModel)]="startDate" (change)="calculateTotal()" required />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Check-out Date</label>
                    <input id="end-date" type="date" class="form-control" [class.is-invalid]="validationError" name="endDate" [(ngModel)]="endDate" (change)="calculateTotal()" required />
                  </div>
                </div>
                
                <div *ngIf="validationError" class="error-message mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  {{ validationError }}
                </div>

                <hr style="border: none; border-top: 1px solid var(--border-color); margin: 2rem 0;">
                
                <h3 class="mb-3">Guest Details</h3>
                <p class="text-muted mb-4">Your booking will be registered under your account email.</p>
                
                <button id="reserve-submit-btn" type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="isLoading || validationError">
                  <span *ngIf="!isLoading">Confirm Reservation &bull; \${{ totalAmount }}</span>
                  <span *ngIf="isLoading">Processing...</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Summary Sidebar -->
          <aside class="checkout-sidebar" *ngIf="!successMsg">
            <div class="card summary-card">
              <div class="summary-img" [style.backgroundImage]="'url(' + room.imageUrl + ')'"></div>
              
              <div class="summary-body">
                <span class="text-xs text-muted font-bold tracking-wide uppercase">Room Selected</span>
                <h3 class="mt-1 mb-2">{{ room.type }}</h3>
                <p class="text-sm text-muted mb-4"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: text-top;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> Up to {{ room.capacity }} guests &bull; Room {{ room.roomNumber }}</p>
                
                <hr class="divider">
                
                <h4 class="mb-3">Price Details</h4>
                <div class="price-row">
                  <span>\${{ room.price }} x {{ numberOfNights }} {{ numberOfNights === 1 ? 'night' : 'nights' }}</span>
                  <span>\${{ totalAmount }}</span>
                </div>
                <div class="price-row">
                  <span>Taxes & Fees</span>
                  <span class="text-success">Included</span>
                </div>
                
                <hr class="divider">
                
                <div class="price-row total-row">
                  <span>Total (USD)</span>
                  <span>\${{ totalAmount }}</span>
                </div>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: start;
    }
    
    @media (min-width: 992px) {
      .checkout-layout { grid-template-columns: 3fr 2fr; gap: 3rem; }
    }
    
    .p-4 { padding: 2rem; }
    .form-row { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .flex-1 { flex: 1; min-width: 200px; }
    
    .summary-card { padding: 0; overflow: hidden; position: sticky; top: 6rem; }
    .summary-img { height: 200px; background-size: cover; background-position: center; }
    .summary-body { padding: 1.5rem 2rem; }
    
    .text-xs { font-size: 0.75rem; }
    .text-sm { font-size: 0.875rem; }
    .font-bold { font-weight: 700; }
    .tracking-wide { letter-spacing: 0.05em; }
    .uppercase { text-transform: uppercase; }
    .text-success { color: var(--success-color); }
    
    .divider { border: none; border-top: 1px solid var(--border-color); margin: 1.5rem 0; }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    
    .total-row {
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 0;
    }
    
    .success-box {
      padding: 4rem 2rem;
      text-align: center;
      background: rgba(16, 185, 129, 0.03);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .success-icon { font-size: 5rem; margin-bottom: 1.5rem; line-height: 1; }
    .text-primary { color: var(--primary-color); }
    .ml-2 { margin-left: 0.5rem; }
    
    /* Animations */
    .slide-up { opacity: 0; transform: translateY(20px); animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    
    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ReservationFormComponent implements OnInit {
  roomId: number = 0;
  room: Room | null = null;
  startDate = '';
  endDate = '';
  
  numberOfNights = 0;
  totalAmount = 0;
  
  successMsg = '';
  errorMsg = '';
  validationError = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private roomService: RoomService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.roomId = +params['roomId'];
      if (this.roomId) {
        this.roomService.getRoomById(this.roomId).subscribe({
          next: (room) => {
            this.room = room;
            this.calculateTotal(); // initial 0
          },
          error: () => this.errorMsg = 'Room not found.'
        });
      } else {
        this.router.navigate(['/rooms']);
      }
    });
  }

  calculateTotal() {
    this.validationError = '';
    this.numberOfNights = 0;
    
    if (this.room && this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      
      // Reset time to avoid timezone issues
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const today = new Date();
      today.setHours(0,0,0,0);
      
      if (start < today) {
        this.validationError = 'Check-in date cannot be in the past.';
      } else if (diffDays <= 0) {
        this.validationError = 'Check-out date must be after check-in date.';
      } else {
        this.numberOfNights = diffDays;
      }
    }
    
    if (this.room) {
      this.totalAmount = this.numberOfNights * this.room.price;
    }
  }

  submit() {
    this.calculateTotal();
    
    if (this.validationError) {
      this.toast.showError(this.validationError);
      return;
    }
    
    if (!this.startDate || !this.endDate) {
      this.validationError = 'Please select both check-in and check-out dates.';
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
        this.successMsg = 'Your booking is confirmed! We look forward to hosting you.';
        this.toast.showSuccess('Reservation successfully created!');
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.showError(err.message || 'Failed to create reservation.');
      }
    });
  }
}
