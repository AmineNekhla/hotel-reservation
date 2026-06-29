import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { Room } from '../../models/room';

@Component({
  selector: 'app-room-list',
  template: `
    <div class="page">
      <div class="header">
        <h2>🏨 Available Rooms</h2>
        <div class="nav-links">
          <a routerLink="/dashboard">My Reservations</a>
          <a routerLink="/admin" *ngIf="isAdmin">Admin Panel</a>
          <a href="#" (click)="logout($event)">Logout</a>
        </div>
      </div>

      <p *ngIf="loading">Loading rooms...</p>
      <p *ngIf="errorMsg" class="error">{{ errorMsg }}</p>

      <div class="rooms-grid" *ngIf="!loading">
        <div class="room-card" *ngFor="let room of rooms">
          <div class="room-header">
            <span class="room-type">{{ room.type }}</span>
            <span class="badge" [class.available]="room.availability" [class.unavailable]="!room.availability">
              {{ room.availability ? 'Available' : 'Reserved' }}
            </span>
          </div>
          <div class="room-details">
            <p>💰 Price: <strong>\${{ room.price }}/night</strong></p>
            <p>👤 Capacity: <strong>{{ room.capacity }} person(s)</strong></p>
          </div>
          <button
            id="reserve-btn-{{ room.id }}"
            (click)="reserve(room)"
            [disabled]="!room.availability"
            [class.disabled-btn]="!room.availability">
            {{ room.availability ? 'Reserve Now' : 'Not Available' }}
          </button>
        </div>
      </div>

      <p *ngIf="!loading && rooms.length === 0">No rooms found.</p>
    </div>
  `,
  styles: [`
    .page { max-width: 1000px; margin: 0 auto; padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    .header h2 { margin: 0; }
    .nav-links a { margin-left: 15px; color: #007bff; text-decoration: none; }
    .nav-links a:hover { text-decoration: underline; }
    .rooms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .room-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .room-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .room-type { font-size: 20px; font-weight: bold; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .available { background: #d4edda; color: #155724; }
    .unavailable { background: #f8d7da; color: #721c24; }
    .room-details p { margin: 8px 0; color: #555; }
    button { width: 100%; padding: 10px; margin-top: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
    button:hover:not(:disabled) { background: #0056b3; }
    .disabled-btn { background: #ccc !important; cursor: not-allowed !important; }
    .error { color: red; }
  `]
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  loading = true;
  errorMsg = '';
  isAdmin = false;

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load rooms. Is the backend running?';
        this.loading = false;
      }
    });
  }

  reserve(room: Room) {
    this.router.navigate(['/reservation'], { queryParams: { roomId: room.id } });
  }

  logout(e: Event) {
    e.preventDefault();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
