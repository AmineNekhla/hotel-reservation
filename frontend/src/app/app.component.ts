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
      
      <!-- Premium Footer -->
      <footer class="footer">
        <div class="container footer-content">
          <div class="footer-brand">
            <a routerLink="/" class="logo" style="color: white; margin-bottom: 1rem; display: inline-flex;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--secondary-color)"><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-3"></path></svg>
              Luxe<span style="color: var(--secondary-color)">Stay</span>
            </a>
            <p style="color: #94A3B8; margin-top: 0.5rem; line-height: 1.6;">Experience unparalleled luxury and comfort at our premier destinations worldwide. Your perfect getaway begins here.</p>
            
            <div class="social-icons" style="margin-top: 1.5rem; display: flex; gap: 1rem;">
              <a href="#" aria-label="Facebook" style="color: #94A3B8; transition: color 0.3s;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#" aria-label="Twitter" style="color: #94A3B8; transition: color 0.3s;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
              <a href="#" aria-label="Instagram" style="color: #94A3B8; transition: color 0.3s;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            </div>
          </div>
          
          <div class="footer-col">
            <h4 style="color: white; margin-bottom: 1.25rem;">Company</h4>
            <ul style="list-style: none; padding: 0; line-height: 2.2;">
              <li><a href="#" style="color: #94A3B8; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94A3B8'">About Us</a></li>
              <li><a href="#" style="color: #94A3B8; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94A3B8'">Careers</a></li>
              <li><a href="#" style="color: #94A3B8; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94A3B8'">Press</a></li>
              <li><a href="#" style="color: #94A3B8; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94A3B8'">Blog</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4 style="color: white; margin-bottom: 1.25rem;">Quick Links</h4>
            <ul style="list-style: none; padding: 0; line-height: 2.2;">
              <li><a routerLink="/rooms" style="color: #94A3B8; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94A3B8'">Our Rooms</a></li>
              <li><a href="#" style="color: #94A3B8; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94A3B8'">Offers & Packages</a></li>
              <li><a href="#" style="color: #94A3B8; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94A3B8'">Dining Experience</a></li>
              <li><a href="#" style="color: #94A3B8; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94A3B8'">Spa & Wellness</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <h4 style="color: white; margin-bottom: 1.25rem;">Newsletter</h4>
            <p style="color: #94A3B8; margin-bottom: 1rem; font-size: 0.9rem;">Subscribe for exclusive offers and updates.</p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <input type="email" placeholder="Email address" style="flex: 1; padding: 0.6rem 1rem; border-radius: var(--radius-md); border: none; outline: none; background: rgba(255,255,255,0.1); color: white; min-width: 150px;">
              <button class="btn btn-primary" style="padding: 0.6rem 1.2rem;">Join</button>
            </div>
          </div>
        </div>
        
        <div class="container footer-links" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <p style="color: #64748B; margin: 0;">&copy; 2026 LuxeStay. Designed for modern hospitality.</p>
          <div style="display: flex; gap: 1.5rem;">
            <a href="#" style="color: #64748B; font-size: 0.875rem; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#64748B'">Privacy Policy</a>
            <a href="#" style="color: #64748B; font-size: 0.875rem; transition: color 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#64748B'">Terms of Service</a>
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
