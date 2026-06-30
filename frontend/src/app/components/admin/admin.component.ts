import { Component, OnInit } from '@angular/core';
import { AdminService, StatsResponse } from '../../services/admin.service';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';
import { Reservation } from '../../models/reservation';
import { User } from '../../models/user';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin',
  template: `
    <div class="page-header" style="padding: 3rem 0;">
      <div class="container">
        <h1 style="font-size: 2.25rem;">Admin Dashboard</h1>
        <p>Monitor your hotel's performance, manage properties, and oversee bookings</p>
      </div>
    </div>

    <div class="container py-5">
      <!-- Stats Overview -->
      <div class="stats-grid mb-5" *ngIf="stats">
        <div class="stat-card slide-up">
          <div class="stat-icon bg-info-light text-info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          </div>
          <div class="stat-content">
            <span class="stat-title">Total Rooms</span>
            <span class="stat-value">{{ stats.totalRooms }}</span>
            <span class="stat-sub text-success">{{ stats.availableRooms }} Available Today</span>
          </div>
        </div>
        <div class="stat-card slide-up delay-1">
          <div class="stat-icon bg-success-light text-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div class="stat-content">
            <span class="stat-title">Active Bookings</span>
            <span class="stat-value">{{ stats.confirmedReservations }}</span>
            <span class="stat-sub text-warning">{{ stats.pendingReservations }} Action Required</span>
          </div>
        </div>
        <div class="stat-card slide-up delay-2">
          <div class="stat-icon bg-warning-light text-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="stat-content">
            <span class="stat-title">Registered Guests</span>
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-sub text-muted">All-time</span>
          </div>
        </div>
        <div class="stat-card slide-up delay-3">
          <div class="stat-icon bg-primary-light text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <div class="stat-content">
            <span class="stat-title">Occupancy Rate</span>
            <span class="stat-value">{{ stats.totalRooms ? (stats.occupiedRooms / stats.totalRooms * 100).toFixed(0) : 0 }}%</span>
            <span class="stat-sub text-muted">{{ stats.occupiedRooms }} out of {{ stats.totalRooms }} Rooms</span>
          </div>
        </div>
      </div>

      <!-- Add New Room Modal Toggle (Simulated with a card form) -->
      <div class="card mb-5 slide-up delay-3">
        <div class="card-header" style="background-color: var(--background-color); border-bottom: 1px solid var(--border-color);">
          <h3 class="mb-0" style="display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            Add New Room Listing
          </h3>
        </div>
        <div class="p-4">
          <form (ngSubmit)="addRoom()">
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Room Number</label>
                <input type="text" class="form-control" name="roomNumber" [(ngModel)]="newRoom.roomNumber" placeholder="e.g. 101" required />
              </div>
              <div class="form-group flex-2">
                <label class="form-label">Room Type</label>
                <input type="text" class="form-control" name="type" [(ngModel)]="newRoom.type" placeholder="e.g. Deluxe Suite" required />
              </div>
              <div class="form-group flex-1">
                <label class="form-label">Price per Night ($)</label>
                <input type="number" class="form-control" name="price" [(ngModel)]="newRoom.price" placeholder="e.g. 299" required />
              </div>
              <div class="form-group flex-1">
                <label class="form-label">Max Capacity</label>
                <input type="number" class="form-control" name="capacity" [(ngModel)]="newRoom.capacity" placeholder="e.g. 2" required />
              </div>
            </div>
            <div class="form-row mt-3">
              <div class="form-group" style="flex: 3;">
                <label class="form-label">Image URL</label>
                <input type="text" class="form-control" name="imageUrl" [(ngModel)]="newRoom.imageUrl" placeholder="https://..." required />
              </div>
              <div class="form-group" style="flex: 1; display: flex; align-items: flex-end;">
                <button type="submit" class="btn btn-primary btn-block" style="height: 46px;">Publish Room</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="dashboard-tables">
        <!-- Room Management -->
        <div class="card mb-5 slide-up delay-1">
          <div class="card-header d-flex justify-between align-center">
            <h3 class="mb-0">Property Inventory</h3>
            <span class="badge badge-info">{{ rooms.length }} Total</span>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Room #</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let room of rooms">
                  <td><strong>{{ room.roomNumber }}</strong></td>
                  <td>{{ room.type }}</td>
                  <td class="font-bold">\${{ room.price }}</td>
                  <td><span class="text-muted">{{ room.capacity }} Guests</span></td>
                  <td>
                    <span class="badge" [class.badge-success]="room.availability" [class.badge-error]="!room.availability">
                      {{ room.availability ? 'Available' : 'Occupied' }}
                    </span>
                  </td>
                  <td class="text-right">
                    <button class="btn btn-danger btn-sm" (click)="deleteRoom(room.id!)">Delete</button>
                  </td>
                </tr>
                <tr *ngIf="rooms.length === 0">
                  <td colspan="6" class="text-center py-5 text-muted">No rooms in inventory. Add one above.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Reservation Management -->
        <div class="card slide-up delay-2">
          <div class="card-header d-flex justify-between align-center">
            <h3 class="mb-0">Reservation Management</h3>
            <span class="badge badge-warning">{{ pendingCount }} Pending</span>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Guest Details</th>
                  <th>Room Details</th>
                  <th>Stay Dates</th>
                  <th>Status</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of reservations">
                  <td>
                    <div class="d-flex flex-column">
                      <strong>{{ r.user.name }}</strong>
                      <span class="text-muted text-xs">{{ r.user.email }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span>{{ r.room.type }}</span>
                      <span class="text-muted text-xs">Room #{{ r.room.roomNumber }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span class="text-xs uppercase text-muted tracking-wide">In: <strong class="text-primary">{{ r.startDate | date:'MMM d' }}</strong></span>
                      <span class="text-xs uppercase text-muted tracking-wide">Out: <strong class="text-primary">{{ r.endDate | date:'MMM d' }}</strong></span>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'badge-warning': r.status === 'PENDING',
                      'badge-success': r.status === 'CONFIRMED',
                      'badge-error': r.status === 'CANCELLED'
                    }">{{ r.status }}</span>
                  </td>
                  <td class="text-right">
                    <div class="action-buttons d-flex justify-end gap-2" *ngIf="r.status === 'PENDING'">
                      <button class="btn btn-outline btn-sm text-success" style="border-color: var(--success-color);" (click)="updateReservationStatus(r.id!, 'CONFIRMED')">Approve</button>
                      <button class="btn btn-outline btn-sm text-danger" style="border-color: var(--danger-color);" (click)="updateReservationStatus(r.id!, 'CANCELLED')">Deny</button>
                    </div>
                    <span *ngIf="r.status !== 'PENDING'" class="text-muted text-xs">Processed</span>
                  </td>
                </tr>
                <tr *ngIf="reservations.length === 0">
                  <td colspan="5" class="text-center py-5 text-muted">No reservations found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mb-0 { margin-bottom: 0; }
    .mb-3 { margin-bottom: 1rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .mb-5 { margin-bottom: 3rem; }
    .mt-3 { margin-top: 1rem; }
    .p-4 { padding: 1.5rem; }
    .py-5 { padding-top: 3rem; padding-bottom: 3rem; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    .stat-card {
      background: var(--surface-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
      transition: transform var(--transition-normal), box-shadow var(--transition-normal);
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }
    
    .stat-icon {
      width: 4rem;
      height: 4rem;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .bg-info-light { background-color: rgba(59, 130, 246, 0.1); }
    .bg-success-light { background-color: rgba(16, 185, 129, 0.1); }
    .bg-warning-light { background-color: rgba(245, 158, 11, 0.1); }
    .bg-primary-light { background-color: rgba(11, 25, 44, 0.1); }
    
    .text-info { color: var(--info-color); }
    .text-success { color: var(--success-color); }
    .text-warning { color: var(--warning-color); }
    .text-primary { color: var(--primary-color); }
    .text-danger { color: var(--danger-color); }
    
    .stat-content { display: flex; flex-direction: column; }
    .stat-title { color: var(--text-secondary); font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-value { font-size: 2rem; font-weight: 800; color: var(--text-primary); line-height: 1.2; margin: 0.25rem 0; }
    .stat-sub { font-size: 0.75rem; font-weight: 600; }
    
    .form-row { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; }
    .flex-1 { flex: 1; min-width: 150px; }
    .flex-2 { flex: 2; min-width: 250px; }
    .form-group { margin-bottom: 0; }
    
    .card-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border-color);
    }
    .card-header h3 { color: var(--primary-color); }
    
    .table-responsive { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { padding: 1rem 2rem; text-align: left; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
    .table th { background-color: var(--background-color); font-weight: 700; color: var(--text-secondary); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .table tbody tr { transition: background-color var(--transition-fast); }
    .table tbody tr:hover { background-color: rgba(248, 250, 252, 0.8); }
    .table td { font-size: 0.95rem; }
    
    .text-right { text-align: right !important; }
    .justify-end { justify-content: flex-end; }
    
    .text-xs { font-size: 0.75rem; }
    .tracking-wide { letter-spacing: 0.05em; }
    .uppercase { text-transform: uppercase; }
    
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
    
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
export class AdminComponent implements OnInit {
  stats: StatsResponse | null = null;
  rooms: Room[] = [];
  reservations: Reservation[] = [];
  pendingCount = 0;
  
  newRoom: any = { 
    roomNumber: '', type: '', description: 'Premium hotel room with modern amenities, stunning views, and absolute comfort designed for the modern traveler.', 
    price: null, capacity: null, imageUrl: ''
  };

  constructor(
    private adminService: AdminService,
    private roomService: RoomService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error(err)
    });
    
    this.roomService.getAllRooms().subscribe({
      next: (data) => this.rooms = data,
      error: (err) => console.error(err)
    });
    
    this.adminService.getAllReservations().subscribe({
      next: (data) => {
        // Sort newest first
        this.reservations = data.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
        this.pendingCount = data.filter(r => r.status === 'PENDING').length;
      },
      error: (err) => console.error(err)
    });
  }

  addRoom() {
    if (!this.newRoom.roomNumber || !this.newRoom.type || !this.newRoom.price) return;
    
    this.adminService.createRoom(this.newRoom).subscribe({
      next: () => {
        this.newRoom = { roomNumber: '', type: '', description: 'Premium hotel room with modern amenities, stunning views, and absolute comfort designed for the modern traveler.', price: null, capacity: null, imageUrl: '' };
        this.toast.showSuccess('Room added to inventory successfully.');
        this.loadData();
      },
      error: (err) => this.toast.showError('Failed to add room: ' + err.message)
    });
  }

  deleteRoom(id: number) {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) return;
    
    this.adminService.deleteRoom(id).subscribe({
      next: () => {
        this.toast.showSuccess('Room deleted successfully.');
        this.loadData();
      },
      error: (err) => this.toast.showError('Failed to delete room. Ensure it has no active reservations.')
    });
  }

  updateReservationStatus(id: number, status: string) {
    this.adminService.updateReservationStatus(id, status).subscribe({
      next: () => {
        this.toast.showSuccess(`Reservation successfully ${status.toLowerCase()}.`);
        this.loadData();
      },
      error: (err) => this.toast.showError('Failed to update reservation status.')
    });
  }
}
