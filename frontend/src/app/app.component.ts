import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="page-wrapper">
      <!-- Navbar -->
      <header class="navbar">
        <div class="container navbar-container">
          <a routerLink="/" class="logo">
            🏨 <span class="logo-text">LuxeStay</span>
          </a>
          
          <nav class="nav-links">
            <a routerLink="/rooms" class="nav-link">Rooms</a>
            
            <ng-container *ngIf="!authService.isLoggedIn()">
              <a routerLink="/login" class="btn btn-secondary nav-btn">Login</a>
              <a routerLink="/signup" class="btn btn-primary nav-btn">Sign Up</a>
            </ng-container>
            
            <ng-container *ngIf="authService.isLoggedIn()">
              <a routerLink="/dashboard" class="nav-link" *ngIf="!authService.isAdmin()">My Bookings</a>
              <a routerLink="/admin" class="nav-link" *ngIf="authService.isAdmin()">Dashboard</a>
              
              <div class="user-menu">
                <span class="user-email">{{ userEmail }}</span>
                <button (click)="logout()" class="btn btn-secondary nav-btn btn-sm">Logout</button>
              </div>
            </ng-container>
          </nav>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="footer">
        <div class="container footer-content">
          <div class="footer-brand">
            <h3>LuxeStay Hotels</h3>
            <p>Experience luxury and comfort at our premier destinations worldwide.</p>
          </div>
          <div class="footer-links">
            <p>&copy; 2026 LuxeStay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit {
  userEmail: string | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateUser();
    // In a real app we'd use an auth observable, but for now we'll just check periodically or on init
    // A simple hack to update the email when routes change:
    this.router.events.subscribe(() => {
      this.updateUser();
    });
  }

  updateUser() {
    if (this.authService.isLoggedIn()) {
      this.userEmail = this.authService.getCurrentUserEmail();
    } else {
      this.userEmail = null;
    }
  }

  logout() {
    this.authService.logout();
    this.updateUser();
    this.router.navigate(['/']);
  }
}
