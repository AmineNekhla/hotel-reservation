import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="page-wrapper">
      <app-toast></app-toast>
      <!-- Navbar -->
      <header class="navbar">
        <div class="container navbar-container">
          <a routerLink="/" class="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--secondary-color)"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-3"></path><path d="M9 9v.01"></path><path d="M9 13v.01"></path><path d="M9 17v.01"></path></svg>
            Luxe<span>Stay</span>
          </a>
          
          <nav class="nav-links">
            <a routerLink="/rooms" class="nav-link" routerLinkActive="active">Rooms</a>
            
            <ng-container *ngIf="!authService.isLoggedIn()">
              <a routerLink="/login" class="nav-link">Sign In</a>
              <a routerLink="/signup" class="btn btn-primary btn-sm ml-2">Register</a>
            </ng-container>
            
            <ng-container *ngIf="authService.isLoggedIn()">
              <a routerLink="/dashboard" class="nav-link" routerLinkActive="active" *ngIf="!authService.isAdmin()">My Trips</a>
              <a routerLink="/admin" class="nav-link" routerLinkActive="active" *ngIf="authService.isAdmin()">Dashboard</a>
              
              <div class="user-menu">
                <span class="user-email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px; vertical-align: middle;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  {{ userEmail }}
                </span>
                <button (click)="logout()" class="btn btn-outline btn-sm" title="Log Out">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
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
            <a routerLink="/" class="logo" style="color: white; margin-bottom: 1rem; display: inline-flex;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--secondary-color)"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-3"></path></svg>
              Luxe<span style="color: var(--secondary-color)">Stay</span>
            </a>
            <p>Experience unparalleled luxury and comfort at our premier destinations worldwide. Your perfect getaway begins here.</p>
          </div>
          <div class="footer-col">
            <h4 style="color: white; margin-bottom: 1rem;">Explore</h4>
            <ul style="list-style: none; padding: 0; line-height: 2;">
              <li><a href="#" style="color: #94A3B8;">Our Hotels</a></li>
              <li><a href="#" style="color: #94A3B8;">Offers & Packages</a></li>
              <li><a href="#" style="color: #94A3B8;">Dining Experience</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4 style="color: white; margin-bottom: 1rem;">Support</h4>
            <ul style="list-style: none; padding: 0; line-height: 2;">
              <li><a href="#" style="color: #94A3B8;">Contact Us</a></li>
              <li><a href="#" style="color: #94A3B8;">FAQ</a></li>
              <li><a href="#" style="color: #94A3B8;">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div class="container footer-links">
          <p>&copy; 2026 LuxeStay. Designed for modern hospitality.</p>
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
