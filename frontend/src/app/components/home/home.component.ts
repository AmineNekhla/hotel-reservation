import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="hero">
      <div class="container hero-content">
        <h1>Find Your Perfect Stay</h1>
        <p>Discover luxury rooms and suites for your next unforgettable getaway.</p>
        <div class="hero-actions">
          <a routerLink="/rooms" class="btn btn-primary btn-lg">Browse Rooms</a>
        </div>
      </div>
    </div>

    <div class="container features">
      <div class="feature-card">
        <h3>✨ Luxury Experience</h3>
        <p>Premium amenities and world-class service.</p>
      </div>
      <div class="feature-card">
        <h3>📍 Prime Locations</h3>
        <p>Situated in the heart of the city's best attractions.</p>
      </div>
      <div class="feature-card">
        <h3>🔒 Secure Booking</h3>
        <p>Instant confirmation with our secure reservation system.</p>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(rgba(0, 53, 128, 0.7), rgba(0, 53, 128, 0.8)), url('https://images.unsplash.com/photo-1542314831-c6a4d14d8373?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover;
      color: white;
      padding: 6rem 0;
      text-align: center;
      margin-top: -2rem; /* Pull up into main content padding */
      margin-bottom: 4rem;
    }
    .hero h1 {
      font-size: 3rem;
      color: white;
      margin-bottom: 1rem;
    }
    .hero p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    .btn-lg {
      padding: 0.875rem 2rem;
      font-size: 1.125rem;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }
    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      text-align: center;
    }
    .feature-card h3 {
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }
  `]
})
export class HomeComponent {

}
