import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Reservation } from '../../models/reservation';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page">
      <div class="header">
        <h2>📋 My Reservations</h2>
        <div class="nav-links">
          <a routerLink="/rooms">Browse Rooms</a>
          <a href="#" (click)="logout($event)">Logout</a>
        </div>
      </div>

      <p *ngIf="userName">Welcome, <strong>{{ userName }}</strong>!</p>
      <p *ngIf="loading">Loading your reservations...</p>
      <p *ngIf="errorMsg" class="error">{{ errorMsg }}</p>

      <div *ngIf="!loading && reservations.length === 0">
        <p>You have no reservations yet. <a routerLink="/rooms">Browse rooms</a> to get started.</p>
      </div>

      <table *ngIf="!loading && reservations.length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th>Room Type</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of reservations; let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ r.room?.type || 'N/A' }}</td>
            <td>{{ r.startDate }}</td>
            <td>{{ r.endDate }}</td>
            <td><span class="status">{{ r.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    .header h2 { margin: 0; }
    .nav-links a { margin-left: 15px; color: #007bff; text-decoration: none; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #007bff; color: white; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #ddd; }
    tr:hover { background: #f5f5f5; }
    .status { background: #d4edda; color: #155724; padding: 3px 8px; border-radius: 12px; font-size: 12px; }
    .error { color: red; }
  `]
})
export class DashboardComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = true;
  errorMsg = '';
  userName = '';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/']);
      return;
    }
    this.userName = user.name;
    this.reservationService.getByUserId(user.id!).subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load reservations.';
        this.loading = false;
      }
    });
  }

  logout(e: Event) {
    e.preventDefault();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
