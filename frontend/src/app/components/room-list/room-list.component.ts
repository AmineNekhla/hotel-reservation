import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';

@Component({
  selector: 'app-room-list',
  template: `
    <div class="page-header">
      <div class="container">
        <h1>Discover Our Rooms</h1>
        <p>Find the perfect space tailored to your needs</p>
      </div>
    </div>

    <div class="container py-4 page-layout">
      <!-- Sidebar Filters -->
      <aside class="filters-sidebar card">
        <div class="filter-header">
          <h3>Filters</h3>
          <button class="btn btn-outline btn-sm" (click)="resetFilters()">Reset</button>
        </div>
        
        <div class="filter-group">
          <label class="form-label">Room Type</label>
          <select class="form-control" [(ngModel)]="filters.type" (change)="applyFilters()">
            <option value="">All Types</option>
            <option value="Single">Single Room</option>
            <option value="Double">Double Room</option>
            <option value="Suite">Luxury Suite</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label class="form-label">Max Price: \${{ filters.maxPrice }}</label>
          <input type="range" class="form-control" min="50" max="1000" step="50" [(ngModel)]="filters.maxPrice" (change)="applyFilters()" style="padding: 0;">
        </div>
        
        <div class="filter-group">
          <label class="form-label">Minimum Guests</label>
          <input type="number" class="form-control" min="1" max="10" [(ngModel)]="filters.capacity" (input)="applyFilters()">
        </div>
        
        <div class="filter-group" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem;">
          <input type="checkbox" id="availToggle" [(ngModel)]="filters.availableOnly" (change)="applyFilters()">
          <label for="availToggle" class="form-label" style="margin: 0; cursor: pointer;">Show Available Only</label>
        </div>
      </aside>

      <!-- Main Grid -->
      <main class="rooms-main">
        <app-loading-spinner [loading]="loading"></app-loading-spinner>
        
        <div *ngIf="errorMsg" class="error-message text-center py-4">
          {{ errorMsg }}
        </div>

        <div class="rooms-grid" *ngIf="!loading && filteredRooms.length > 0">
          <div class="card room-card" *ngFor="let room of filteredRooms" [routerLink]="['/rooms', room.id]" style="cursor: pointer;">
            <div class="room-image-wrapper">
              <img [src]="room.imageUrl" [alt]="room.type" class="room-image" onerror="this.src='https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" />
              <div class="room-price-badge">\${{ room.price }}<span>/night</span></div>
              <div class="room-badges">
                <span class="badge" [class.badge-success]="room.availability" [class.badge-error]="!room.availability">
                  {{ room.availability ? 'Available' : 'Reserved' }}
                </span>
              </div>
            </div>
            
            <div class="room-content">
              <h3>{{ room.type }}</h3>
              <p class="room-description">{{ room.description | slice:0:100 }}...</p>
              
              <div class="room-amenities">
                <span title="Guests"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> {{ room.capacity }} Guests</span>
                <span title="Room"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> No. {{ room.roomNumber }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && filteredRooms.length === 0 && !errorMsg" class="empty-state card py-5 text-center">
          <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">🔍</div>
          <h3>No rooms found</h3>
          <p class="text-muted mb-4">Try adjusting your filters to find available rooms.</p>
          <button class="btn btn-primary" (click)="resetFilters()">Clear Filters</button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .page-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    @media (min-width: 992px) {
      .page-layout {
        grid-template-columns: 300px 1fr;
      }
    }
    
    .filters-sidebar {
      padding: 1.5rem;
      height: fit-content;
      position: sticky;
      top: 6rem;
    }
    
    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .filter-group {
      margin-bottom: 1.25rem;
    }
    
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
      height: 220px;
      overflow: hidden;
    }
    
    .room-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .room-card:hover .room-image {
      transform: scale(1.08);
    }
    
    .room-badges {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
    
    .room-price-badge {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(4px);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      font-weight: 700;
      color: var(--primary-color);
      box-shadow: var(--shadow-md);
    }
    
    .room-price-badge span {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .room-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .room-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-top: 0.5rem;
      margin-bottom: 1.5rem;
      flex: 1;
    }
    
    .room-amenities {
      display: flex;
      gap: 1.5rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
    }
    
    .room-amenities span {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }
    
    .empty-state {
      max-width: 500px;
      margin: 0 auto;
    }
  `]
})
export class RoomListComponent implements OnInit {
  allRooms: Room[] = [];
  filteredRooms: Room[] = [];
  loading = true;
  errorMsg = '';
  
  filters = {
    type: '',
    maxPrice: 1000,
    capacity: 1,
    availableOnly: false
  };

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this.allRooms = data;
        
        // Find actual max price to set range slider
        if (data.length > 0) {
          this.filters.maxPrice = Math.max(...data.map(r => r.price)) + 50;
        }
        
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load rooms. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  resetFilters() {
    this.filters = {
      type: '',
      maxPrice: Math.max(...this.allRooms.map(r => r.price)) + 50,
      capacity: 1,
      availableOnly: false
    };
    this.applyFilters();
  }

  applyFilters() {
    this.filteredRooms = this.allRooms.filter(room => {
      if (this.filters.type && room.type.toLowerCase() !== this.filters.type.toLowerCase()) {
        return false;
      }
      if (room.price > this.filters.maxPrice) {
        return false;
      }
      if (room.capacity < this.filters.capacity) {
        return false;
      }
      if (this.filters.availableOnly && !room.availability) {
        return false;
      }
      return true;
    });
  }
}
