import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-room-detail',
  template: `
    <app-loading-spinner [loading]="loading"></app-loading-spinner>
    
    <div class="page-wrapper" *ngIf="room && !loading">
      <div class="room-hero">
        <div class="hero-bg" [style.backgroundImage]="'url(' + room.imageUrl + ')'"></div>
        <div class="container hero-content">
          <div class="badge mb-3" [class.badge-success]="room.availability" [class.badge-error]="!room.availability" style="background-color: var(--surface-color);">
            {{ room.availability ? 'Available for Booking' : 'Currently Reserved' }}
          </div>
          <h1>{{ room.type }}</h1>
          <p class="room-location"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> LuxeStay Signature Collection</p>
        </div>
      </div>

      <div class="container py-5 content-layout">
        <!-- Main Description -->
        <main class="room-details-main">
          <h2>About this space</h2>
          <p class="description">{{ room.description }}</p>
          
          <h3 class="mt-4 mb-3">Room Highlights</h3>
          <div class="highlights-grid">
            <div class="highlight-item">
              <div class="icon-circle">👤</div>
              <div>
                <strong>Capacity</strong>
                <p class="text-muted text-sm">Up to {{ room.capacity }} guests</p>
              </div>
            </div>
            <div class="highlight-item">
              <div class="icon-circle">🚪</div>
              <div>
                <strong>Room Number</strong>
                <p class="text-muted text-sm">Suite #{{ room.roomNumber }}</p>
              </div>
            </div>
            <div class="highlight-item">
              <div class="icon-circle">📶</div>
              <div>
                <strong>Free Wi-Fi</strong>
                <p class="text-muted text-sm">High-speed internet</p>
              </div>
            </div>
            <div class="highlight-item">
              <div class="icon-circle">☕</div>
              <div>
                <strong>Breakfast</strong>
                <p class="text-muted text-sm">Complimentary</p>
              </div>
            </div>
          </div>
        </main>
        
        <!-- Reservation Sidebar Card -->
        <aside class="reservation-sidebar">
          <div class="card booking-card">
            <div class="booking-header">
              <div class="price">
                \${{ room.price }} <span>/ night</span>
              </div>
            </div>
            
            <div class="booking-body">
              <p class="text-muted mb-4 text-center">Secure this room for your next stay.</p>
              
              <button 
                class="btn btn-primary btn-block btn-lg" 
                [disabled]="!room.availability"
                (click)="reserveRoom()">
                {{ room.availability ? 'Reserve Now' : 'Not Available' }}
              </button>
              
              <p class="text-center mt-3 text-muted" style="font-size: 0.8rem;">You won't be charged yet</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .room-hero {
      position: relative;
      height: 50vh;
      min-height: 400px;
      display: flex;
      align-items: flex-end;
      padding-bottom: 3rem;
      margin-top: -1px;
    }
    
    .hero-bg {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-size: cover;
      background-position: center;
      z-index: 1;
    }
    
    .hero-bg::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to top, rgba(11, 25, 44, 0.9) 0%, rgba(11, 25, 44, 0.2) 100%);
    }
    
    .hero-content {
      position: relative;
      z-index: 2;
      color: white;
    }
    
    .hero-content h1 {
      font-size: clamp(2rem, 4vw, 3.5rem);
      color: white;
      margin-bottom: 0.5rem;
    }
    
    .room-location {
      display: flex;
      align-items: center;
      opacity: 0.9;
      font-size: 1.125rem;
    }
    
    .content-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    
    @media (min-width: 992px) {
      .content-layout {
        grid-template-columns: 2fr 1fr;
      }
    }
    
    .description {
      font-size: 1.125rem;
      line-height: 1.8;
      color: var(--text-secondary);
    }
    
    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .highlight-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(59, 130, 246, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    
    .text-sm {
      font-size: 0.875rem;
      margin: 0;
    }
    
    .reservation-sidebar {
      position: relative;
    }
    
    .booking-card {
      position: sticky;
      top: 6rem;
      padding: 0;
      border-top: 4px solid var(--secondary-color);
    }
    
    .booking-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .price {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .price span {
      font-size: 1rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .booking-body {
      padding: 2rem;
    }
  `]
})
export class RoomDetailComponent implements OnInit {
  room: Room | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.roomService.getRoomById(Number(idParam)).subscribe({
        next: (data) => {
          this.room = data;
          this.loading = false;
        },
        error: () => {
          this.toast.showError('Could not load room details.');
          this.loading = false;
          this.router.navigate(['/rooms']);
        }
      });
    }
  }

  reserveRoom() {
    if (this.room) {
      this.router.navigate(['/reservation'], { queryParams: { roomId: this.room.id } });
    }
  }
}
