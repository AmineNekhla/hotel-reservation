import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';

@Component({
  selector: 'app-home',
  template: `
    <!-- Hero Section -->
    <div class="hero">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <span class="hero-badge slide-up">Welcome to LuxeStay</span>
        <h1 class="slide-up delay-1">Find Your Perfect Getaway</h1>
        <p class="slide-up delay-2">Discover extraordinary luxury, world-class service, and breathtaking destinations designed for your ultimate comfort.</p>
        <div class="hero-actions slide-up delay-3">
          <a routerLink="/rooms" class="btn btn-primary btn-lg">Explore Rooms</a>
        </div>
      </div>
    </div>

    <!-- Feature Section -->
    <div class="container py-5">
      <div class="section-title text-center mb-5">
        <h2>Why Choose LuxeStay</h2>
        <p class="text-muted">Experience hospitality redefined with our signature amenities.</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <h3>Luxury Experience</h3>
          <p>Premium amenities, designer furnishings, and world-class room service available 24/7.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📍</div>
          <h3>Prime Locations</h3>
          <p>Situated in the heart of the city, steps away from major attractions and dining.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Secure Booking</h3>
          <p>Instant confirmation with our secure reservation system and flexible cancellation.</p>
        </div>
      </div>
    </div>

    <!-- Popular Rooms Section -->
    <div class="popular-rooms-section">
      <div class="container py-5">
        <div class="d-flex justify-between align-center mb-4">
          <div class="section-title">
            <h2>Popular Destinations</h2>
            <p class="text-muted">Explore our most sought-after accommodations</p>
          </div>
          <a routerLink="/rooms" class="btn btn-outline hidden-mobile">View All Rooms &rarr;</a>
        </div>
        
        <app-loading-spinner [loading]="loading"></app-loading-spinner>

        <div class="rooms-grid" *ngIf="!loading">
          <div class="card room-card" *ngFor="let room of popularRooms" [routerLink]="['/rooms', room.id]" style="cursor: pointer;">
            <div class="room-image-wrapper">
              <img [src]="room.imageUrl" [alt]="room.type" class="room-image" onerror="this.src='https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" />
              <div class="room-price-badge">\${{ room.price }}<span>/night</span></div>
            </div>
            
            <div class="room-content">
              <h3>{{ room.type }}</h3>
              <p class="text-muted mb-3" style="font-size: 0.875rem;">{{ room.description | slice:0:80 }}...</p>
              
              <div class="room-amenities">
                <span title="Guests"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> {{ room.capacity }} Guests</span>
                <span title="Room"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> No. {{ room.roomNumber }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-4 hidden-desktop">
          <a routerLink="/rooms" class="btn btn-outline btn-block">View All Rooms</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url('https://images.unsplash.com/photo-1542314831-c6a4d14d8373?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover fixed;
      margin-top: -1px; /* seamless with nav */
    }
    
    .hero-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to right, rgba(11, 25, 44, 0.9), rgba(11, 25, 44, 0.4));
      z-index: 1;
    }
    
    .hero-content {
      position: relative;
      z-index: 2;
      color: white;
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .hero-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(8px);
    }
    
    .hero h1 {
      font-size: clamp(2.5rem, 5vw, 4.5rem);
      color: white;
      margin-bottom: 1.5rem;
      letter-spacing: -0.02em;
    }
    
    .hero p {
      font-size: clamp(1.125rem, 2vw, 1.25rem);
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2.5rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .btn-lg {
      padding: 1rem 2.5rem;
      font-size: 1.125rem;
      border-radius: var(--radius-full);
    }
    
    /* Animations */
    .slide-up {
      opacity: 0;
      transform: translateY(30px);
      animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .delay-1 { animation-delay: 0.2s; }
    .delay-2 { animation-delay: 0.4s; }
    .delay-3 { animation-delay: 0.6s; }
    
    @keyframes fadeUp {
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* Section Titles */
    .section-title h2 {
      font-size: 2.25rem;
      margin-bottom: 0.5rem;
    }
    
    /* Features */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background: var(--surface-color);
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
      text-align: center;
      transition: all var(--transition-normal);
    }
    
    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      border-color: rgba(59, 130, 246, 0.3);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      display: inline-block;
      padding: 1rem;
      background: var(--background-color);
      border-radius: var(--radius-full);
    }
    
    .feature-card h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }
    
    .feature-card p {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    
    /* Popular Rooms */
    .popular-rooms-section {
      background-color: var(--background-color);
    }
    
    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;
    }
    
    .room-image-wrapper {
      position: relative;
      height: 240px;
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
    
    .room-price-badge {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
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
    
    .hidden-mobile { display: block; }
    .hidden-desktop { display: none; }
    
    @media (max-width: 768px) {
      .hidden-mobile { display: none; }
      .hidden-desktop { display: block; }
      .hero { min-height: 70vh; }
    }
  `]
})
export class HomeComponent implements OnInit {
  popularRooms: Room[] = [];
  loading = true;

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.roomService.getAllRooms().subscribe({
      next: (rooms) => {
        // Display top 3 rooms
        this.popularRooms = rooms.slice(0, 3);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
