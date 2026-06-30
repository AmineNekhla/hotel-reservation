import { Component, OnInit } from '@angular/core';
import { AdminService, StatsResponse } from '../../services/admin.service';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';
import { Reservation } from '../../models/reservation';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin',
  template: `
    <div class="page-header">
      <div class="container">
        <h1>Admin Dashboard</h1>
        <p>Manage your hotel properties, bookings, and users</p>
      </div>
    </div>

    <div class="container py-4">
      <!-- Stats Overview -->
      <div class="stats-grid mb-4" *ngIf="stats">
        <div class="stat-card">
          <div class="stat-icon bg-primary">🛏️</div>
          <div class="stat-content">
            <span class="stat-title">Total Rooms</span>
            <span class="stat-value">{{ stats.totalRooms }}</span>
            <span class="stat-sub text-success">{{ stats.availableRooms }} Available</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-success">✅</div>
          <div class="stat-content">
            <span class="stat-title">Active Bookings</span>
            <span class="stat-value">{{ stats.confirmedReservations }}</span>
            <span class="stat-sub text-warning">{{ stats.pendingReservations }} Pending</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-warning">👥</div>
          <div class="stat-content">
            <span class="stat-title">Registered Users</span>
            <span class="stat-value">{{ stats.totalUsers }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon bg-danger">📈</div>
          <div class="stat-content">
            <span class="stat-title">Occupancy</span>
            <span class="stat-value">{{ stats.totalRooms ? (stats.occupiedRooms / stats.totalRooms * 100).toFixed(0) : 0 }}%</span>
            <span class="stat-sub">{{ stats.occupiedRooms }} Rooms</span>
          </div>
        </div>
      </div>

      <!-- Add New Room -->
      <div class="card mb-4 p-4">
        <h3 class="mb-3">➕ Add New Room</h3>
        <form (ngSubmit)="addRoom()" class="form-row">
          <div class="form-group flex-1">
            <input type="text" class="form-control" name="roomNumber" [(ngModel)]="newRoom.roomNumber" placeholder="Room Number (e.g. 101)" required />
          </div>
          <div class="form-group flex-1">
            <input type="text" class="form-control" name="type" [(ngModel)]="newRoom.type" placeholder="Type (e.g. Deluxe Suite)" required />
          </div>
          <div class="form-group flex-1">
            <input type="number" class="form-control" name="price" [(ngModel)]="newRoom.price" placeholder="Price ($)" required />
          </div>
          <div class="form-group flex-1">
            <input type="number" class="form-control" name="capacity" [(ngModel)]="newRoom.capacity" placeholder="Capacity" required />
          </div>
          <div class="form-group flex-2">
            <input type="text" class="form-control" name="imageUrl" [(ngModel)]="newRoom.imageUrl" placeholder="Image URL" required />
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary" style="height: 48px;">Add Room</button>
          </div>
        </form>
      </div>

      <!-- Room Management -->
      <div class="card mb-4">
        <div class="card-header">
          <h3>🛏️ Manage Rooms</h3>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let room of rooms">
                <td><strong>{{ room.roomNumber }}</strong></td>
                <td>{{ room.type }}</td>
                <td>\${{ room.price }}</td>
                <td>{{ room.capacity }}</td>
                <td>
                  <span class="badge" [class.badge-success]="room.availability" [class.badge-error]="!room.availability">
                    {{ room.availability ? 'Available' : 'Occupied' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-secondary btn-sm" (click)="deleteRoom(room.id!)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reservation Management -->
      <div class="card mb-4">
        <div class="card-header">
          <h3>📋 Manage Reservations</h3>
        </div>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of reservations">
                <td>{{ r.user.name }}<br><small class="text-muted">{{ r.user.email }}</small></td>
                <td>{{ r.room.type }} <small>(#{{ r.room.roomNumber }})</small></td>
                <td>{{ r.startDate }} <br>to<br> {{ r.endDate }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-warning': r.status === 'PENDING',
                    'badge-success': r.status === 'CONFIRMED',
                    'badge-error': r.status === 'CANCELLED'
                  }">{{ r.status }}</span>
                </td>
                <td>
                  <div class="action-buttons" *ngIf="r.status === 'PENDING'">
                    <button class="btn btn-primary btn-sm" (click)="updateReservationStatus(r.id!, 'CONFIRMED')">Confirm</button>
                    <button class="btn btn-secondary btn-sm ml-2" (click)="updateReservationStatus(r.id!, 'CANCELLED')">Cancel</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
    .page-header h1 { color: white; margin-bottom: 0.5rem; }
    .page-header p { opacity: 0.8; font-size: 1.125rem; }
    
    .mb-3 { margin-bottom: 1rem; }
    .mb-4 { margin-bottom: 1.5rem; }
    .p-4 { padding: 1.5rem; }
    .py-4 { padding-top: 2rem; padding-bottom: 2rem; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .stat-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: var(--shadow-sm);
    }
    .stat-icon {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }
    .bg-primary { background-color: var(--primary-color); }
    .bg-success { background-color: var(--success-color); }
    .bg-warning { background-color: var(--warning-color); }
    .bg-danger { background-color: var(--danger-color); }
    
    .stat-content { display: flex; flex-direction: column; }
    .stat-title { color: var(--text-secondary); font-size: 0.875rem; font-weight: 500; }
    .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
    .stat-sub { font-size: 0.75rem; font-weight: 500; }
    .text-success { color: var(--success-color); }
    .text-warning { color: var(--warning-color); }
    
    .form-row { display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; }
    .flex-1 { flex: 1; min-width: 120px; }
    .flex-2 { flex: 2; min-width: 200px; }
    .form-group { margin-bottom: 0; }
    
    .card-header {
      padding: 1.5rem 1.5rem 0;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
      margin-bottom: 0;
    }
    .card-header h3 { margin: 0; color: var(--primary-color); }
    
    .table-responsive { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { padding: 1rem 1.5rem; text-align: left; border-bottom: 1px solid var(--border-color); }
    .table th { background-color: #f8fafc; font-weight: 600; color: var(--text-secondary); font-size: 0.875rem; text-transform: uppercase; }
    .table tbody tr:hover { background-color: #f8fafc; }
    
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      display: inline-block;
    }
    .badge-warning { background-color: var(--warning-color); }
    .badge-success { background-color: var(--success-color); }
    .badge-error { background-color: var(--danger-color); }
    
    .text-muted { color: var(--text-secondary); }
    .ml-2 { margin-left: 0.5rem; }
    .action-buttons { display: flex; }
  `]
})
export class AdminComponent implements OnInit {
  stats: StatsResponse | null = null;
  rooms: Room[] = [];
  reservations: Reservation[] = [];
  
  newRoom: any = { 
    roomNumber: '', type: '', description: 'Premium hotel room with modern amenities.', 
    price: null, capacity: null, imageUrl: ''
  };

  constructor(
    private adminService: AdminService,
    private roomService: RoomService
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
      next: (data) => this.reservations = data,
      error: (err) => console.error(err)
    });
  }

  addRoom() {
    if (!this.newRoom.roomNumber || !this.newRoom.type || !this.newRoom.price) return;
    
    this.adminService.createRoom(this.newRoom).subscribe({
      next: () => {
        this.newRoom = { roomNumber: '', type: '', description: 'Premium hotel room with modern amenities.', price: null, capacity: null, imageUrl: '' };
        this.loadData();
      },
      error: (err) => alert('Failed to add room: ' + err.message)
    });
  }

  deleteRoom(id: number) {
    if (!confirm('Are you sure you want to delete this room?')) return;
    
    this.adminService.deleteRoom(id).subscribe({
      next: () => this.loadData(),
      error: (err) => alert('Failed to delete room.')
    });
  }

  updateReservationStatus(id: number, status: string) {
    this.adminService.updateReservationStatus(id, status).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => alert('Failed to update status.')
    });
  }
}
