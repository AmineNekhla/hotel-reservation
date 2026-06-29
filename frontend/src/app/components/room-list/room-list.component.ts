import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';

@Component({
  selector: 'app-room-list',
  template: `
    <div class="page-header">
      <div class="container">
        <h1>Available Rooms</h1>
        <p>Find the perfect space for your stay</p>
      </div>
    </div>

    <div class="container py-4">
      <div *ngIf="loading" class="text-center py-4">
        <p>Loading premium rooms...</p>
      </div>
      
      <div *ngIf="errorMsg" class="error-message text-center py-4">
        {{ errorMsg }}
      </div>

      <div class="rooms-grid" *ngIf="!loading">
        <div class="card room-card" *ngFor="let room of rooms">
          <div class="room-image-wrapper">
            <img [src]="room.imageUrl" [alt]="room.type" class="room-image" onerror="this.src='https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" />
            <div class="room-badges">
              <span class="badge" [class.badge-success]="room.availability" [class.badge-error]="!room.availability">
                {{ room.availability ? 'Available' : 'Reserved' }}
              </span>
            </div>
          </div>
          
          <div class="room-content">
            <div class="room-title-row">
              <h3>{{ room.type }}</h3>
              <span class="room-price">\${{ room.price }}<small>/night</small></span>
            </div>
            
            <p class="room-description">{{ room.description }}</p>
            
            <div class="room-meta">
              <span>👤 Up to {{ room.capacity }} guests</span>
              <span>🚪 Room {{ room.roomNumber }}</span>
            </div>
            
            <button
              class="btn btn-primary btn-block mt-3"
              (click)="reserve(room)"
              [disabled]="!room.availability">
              {{ room.availability ? 'Reserve Now' : 'Not Available' }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && rooms.length === 0" class="text-center py-4">
        <p>No rooms available at the moment.</p>
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
    .text-center { text-align: center; }
    .mt-3 { margin-top: 1rem; }
    .btn-block { width: 100%; }
    
    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }
    
    .room-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .room-image-wrapper {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    
    .room-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-normal);
    }
    
    .room-card:hover .room-image {
      transform: scale(1.05);
    }
    
    .room-badges {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
    
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: white;
      box-shadow: var(--shadow-sm);
    }
    
    .badge-success { background-color: var(--success-color); }
    .badge-error { background-color: var(--danger-color); }
    
    .room-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .room-title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }
    
    .room-title-row h3 {
      font-size: 1.25rem;
      color: var(--primary-color);
      margin: 0;
    }
    
    .room-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--secondary-color);
    }
    
    .room-price small {
      font-size: 0.875rem;
      font-weight: 400;
      color: var(--text-secondary);
    }
    
    .room-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      flex: 1;
    }
    
    .room-meta {
      display: flex;
      justify-content: space-between;
      color: var(--text-primary);
      font-size: 0.875rem;
      font-weight: 500;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }
  `]
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  loading = true;
  errorMsg = '';

  constructor(
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit() {
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load rooms. Please try again later.';
        this.loading = false;
      }
    });
  }

  reserve(room: Room) {
    this.router.navigate(['/reservation'], { queryParams: { roomId: room.id } });
  }
}
