import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Room } from '../../models/room';
import { Reservation } from '../../models/reservation';

@Component({
  selector: 'app-admin',
  template: `
    <div class="page">
      <div class="header">
        <h2>⚙️ Admin Panel</h2>
        <div class="nav-links">
          <a routerLink="/rooms">View Rooms</a>
          <a href="#" (click)="logout($event)">Logout</a>
        </div>
      </div>

      <!-- Add Room Section -->
      <div class="section">
        <h3>➕ Add New Room</h3>
        <form (ngSubmit)="addRoom()" class="add-room-form">
          <input id="admin-room-type" type="text" name="type" [(ngModel)]="newRoom.type" placeholder="Room Type (e.g. Suite)" required />
          <input id="admin-room-price" type="number" name="price" [(ngModel)]="newRoom.price" placeholder="Price per night" required />
          <input id="admin-room-capacity" type="number" name="capacity" [(ngModel)]="newRoom.capacity" placeholder="Capacity" required />
          <button id="admin-add-room-btn" type="submit">Add Room</button>
        </form>
        <p *ngIf="roomSuccessMsg" class="success">{{ roomSuccessMsg }}</p>
        <p *ngIf="roomErrorMsg" class="error">{{ roomErrorMsg }}</p>
      </div>

      <!-- Rooms Table -->
      <div class="section">
        <h3>🛏️ All Rooms</h3>
        <table *ngIf="rooms.length > 0">
          <thead>
            <tr><th>ID</th><th>Type</th><th>Price</th><th>Capacity</th><th>Available</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let room of rooms">
              <td>{{ room.id }}</td>
              <td>{{ room.type }}</td>
              <td>\${{ room.price }}</td>
              <td>{{ room.capacity }}</td>
              <td>{{ room.availability ? 'Yes' : 'No' }}</td>
              <td>
                <button id="delete-room-{{ room.id }}" class="delete-btn" (click)="deleteRoom(room.id!)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="rooms.length === 0">No rooms found.</p>
      </div>

      <!-- All Reservations -->
      <div class="section">
        <h3>📋 All Reservations</h3>
        <table *ngIf="reservations.length > 0">
          <thead>
            <tr><th>ID</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of reservations">
              <td>{{ r.id }}</td>
              <td>{{ r.user?.name || 'N/A' }}</td>
              <td>{{ r.room?.type || 'N/A' }}</td>
              <td>{{ r.startDate }}</td>
              <td>{{ r.endDate }}</td>
              <td><span class="status">{{ r.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="reservations.length === 0">No reservations yet.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1000px; margin: 0 auto; padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #dc3545; padding-bottom: 10px; }
    .header h2 { margin: 0; }
    .nav-links a { margin-left: 15px; color: #007bff; text-decoration: none; }
    .section { margin-bottom: 40px; }
    .section h3 { color: #333; border-left: 4px solid #007bff; padding-left: 10px; }
    .add-room-form { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
    .add-room-form input { padding: 10px; border: 1px solid #ccc; border-radius: 4px; flex: 1; min-width: 150px; }
    .add-room-form button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .add-room-form button:hover { background: #0056b3; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #343a40; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    tr:hover { background: #f5f5f5; }
    .delete-btn { background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
    .delete-btn:hover { background: #a71d2a; }
    .status { background: #d4edda; color: #155724; padding: 3px 8px; border-radius: 12px; font-size: 12px; }
    .success { color: green; }
    .error { color: red; }
  `]
})
export class AdminComponent implements OnInit {
  rooms: Room[] = [];
  reservations: Reservation[] = [];
  newRoom: Room = { type: '', price: 0, capacity: 1, availability: true };
  roomSuccessMsg = '';
  roomErrorMsg = '';

  constructor(
    private roomService: RoomService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRooms();
    this.loadReservations();
  }

  loadRooms() {
    this.roomService.getAllRooms().subscribe({
      next: (data) => this.rooms = data,
      error: () => console.error('Failed to load rooms')
    });
  }

  loadReservations() {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => this.reservations = data,
      error: () => console.error('Failed to load reservations')
    });
  }

  addRoom() {
    this.roomSuccessMsg = '';
    this.roomErrorMsg = '';
    this.roomService.addRoom(this.newRoom).subscribe({
      next: (room) => {
        this.rooms.push(room);
        this.newRoom = { type: '', price: 0, capacity: 1, availability: true };
        this.roomSuccessMsg = 'Room added successfully!';
      },
      error: () => {
        this.roomErrorMsg = 'Failed to add room.';
      }
    });
  }

  deleteRoom(id: number) {
    if (confirm('Are you sure you want to delete this room?')) {
      this.roomService.deleteRoom(id).subscribe({
        next: () => {
          this.rooms = this.rooms.filter(r => r.id !== id);
        },
        error: () => alert('Failed to delete room.')
      });
    }
  }

  logout(e: Event) {
    e.preventDefault();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
