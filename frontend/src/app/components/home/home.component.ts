import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room';

@Component({
  selector: 'app-home',
  template: `
    <!-- Hero Section -->
    <div class="hero fade-in">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <span class="hero-badge slide-up">Luxury Hotel Experience</span>
        <h1 class="slide-up delay-1">Welcome to LuxeStay</h1>
        <p class="slide-up delay-2">Discover extraordinary luxury, world-class service, and breathtaking destinations designed for your ultimate comfort.</p>
        <div class="hero-actions slide-up delay-3">
          <a routerLink="/rooms" class="btn btn-primary btn-lg">Explore Rooms</a>
          <a routerLink="/dashboard" class="btn btn-outline-light btn-lg ml-3">My Bookings</a>
        </div>
      </div>
    </div>
    
    <!-- Trust Section -->
    <div class="trust-section fade-in delay-4">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-item">
            <div class="trust-icon">⭐</div>
            <div class="trust-text">
              <strong>4.9 Guest Rating</strong>
              <span>★★★★★</span>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-icon">👥</div>
            <div class="trust-text">
              <strong>5,000+</strong>
              <span>Happy Guests</span>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-icon">🛌</div>
            <div class="trust-text">
              <strong>120+</strong>
              <span>Luxury Rooms</span>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-icon">🌍</div>
            <div class="trust-text">
              <strong>35</strong>
              <span>Premium Locations</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Section -->
    <div class="container py-5">
      <div class="section-title text-center mb-5 slide-up">
        <h2>Our Signature Amenities</h2>
        <p class="text-muted">Experience hospitality redefined with our world-class services.</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card hover-lift slide-up delay-1">
          <div class="feature-icon-lg">✨</div>
          <h3>Luxury Experience</h3>
          <p>Premium amenities, designer furnishings, and world-class room service available 24/7 for your ultimate comfort.</p>
        </div>
        <div class="feature-card hover-lift slide-up delay-2">
          <div class="feature-icon-lg">📍</div>
          <h3>Prime Locations</h3>
          <p>Situated in the heart of the city, steps away from major attractions, luxury shopping, and fine dining.</p>
        </div>
        <div class="feature-card hover-lift slide-up delay-3">
          <div class="feature-icon-lg">🔒</div>
          <h3>Secure Booking</h3>
          <p>Instant confirmation with our secure reservation system, best price guarantee, and flexible cancellation.</p>
        </div>
      </div>
    </div>

    <!-- Popular Rooms Section -->
    <div class="popular-rooms-section">
      <div class="container py-5">
        <div class="d-flex justify-between align-center mb-5 slide-up">
          <div class="section-title" style="margin-bottom: 0;">
            <h2>Featured Rooms</h2>
            <p class="text-muted">Explore our most sought-after luxury accommodations</p>
          </div>
          <a routerLink="/rooms" class="btn btn-outline hidden-mobile">View All Rooms &rarr;</a>
        </div>
        
        <app-loading-spinner [loading]="loading"></app-loading-spinner>

        <div class="rooms-grid" *ngIf="!loading">
          <div class="card room-card hover-lift slide-up" *ngFor="let room of popularRooms; let i = index" [ngStyle]="{'animation-delay': (i * 0.2) + 's'}">
            <div class="room-image-wrapper">
              <img [src]="room.imageUrl" [alt]="room.type" class="room-image" onerror="this.src='https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" />
              <div class="room-price-badge">\${{ room.price }}<span>/night</span></div>
            </div>
            
            <div class="room-content">
              <h3>{{ room.type }} Suite</h3>
              <p class="text-muted mb-3" style="font-size: 0.9rem; line-height: 1.5;">{{ room.description | slice:0:80 }}...</p>
              
              <div class="room-amenities mb-4">
                <span title="Guests"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> {{ room.capacity }} Guests</span>
                <span title="Room Size"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> 45m²</span>
              </div>
              
              <a [routerLink]="['/rooms', room.id]" class="btn btn-primary btn-block">Reserve Now</a>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-5 hidden-desktop">
          <a routerLink="/rooms" class="btn btn-outline btn-block">View All Rooms</a>
        </div>
      </div>
    </div>
    
    <!-- Why Choose Us -->
    <div class="container py-5 mt-4">
      <div class="row" style="display: flex; flex-wrap: wrap; gap: 3rem; align-items: center;">
        <div class="col" style="flex: 1; min-width: 300px;">
          <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem;">Why Choose LuxeStay</h2>
          <p class="text-muted" style="margin-bottom: 2rem; font-size: 1.1rem;">We blend timeless elegance with modern luxury. Whether you are traveling for business or leisure, our properties offer unparalleled service and comfort.</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            <div class="choose-item">
              <div class="choose-icon">👑</div>
              <h4 style="margin: 0.5rem 0;">Luxury Rooms</h4>
              <p class="text-muted" style="font-size: 0.85rem;">Meticulously designed for your ultimate comfort.</p>
            </div>
            <div class="choose-item">
              <div class="choose-icon">🎧</div>
              <h4 style="margin: 0.5rem 0;">24/7 Support</h4>
              <p class="text-muted" style="font-size: 0.85rem;">Our concierge is always available to assist you.</p>
            </div>
            <div class="choose-item">
              <div class="choose-icon">💰</div>
              <h4 style="margin: 0.5rem 0;">Best Price</h4>
              <p class="text-muted" style="font-size: 0.85rem;">Guaranteed best rates when you book directly.</p>
            </div>
            <div class="choose-item">
              <div class="choose-icon">💻</div>
              <h4 style="margin: 0.5rem 0;">Easy Booking</h4>
              <p class="text-muted" style="font-size: 0.85rem;">Seamless online reservations in just a few clicks.</p>
            </div>
          </div>
        </div>
        <div class="col" style="flex: 1; min-width: 300px;">
          <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Luxury Hotel Lobby" style="width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);">
        </div>
      </div>
    </div>
    
    <!-- Testimonials -->
    <div class="testimonials-section py-5 mt-4" style="background-color: var(--primary-color); color: white;">
      <div class="container py-4">
        <div class="text-center mb-5">
          <h2 style="color: white;">What Our Guests Say</h2>
          <p style="color: #94A3B8;">Read reviews from travelers who have experienced LuxeStay.</p>
        </div>
        
        <div class="features-grid">
          <div class="testimonial-card">
            <div class="rating">★★★★★</div>
            <p>"Exceptional service and beautiful rooms. The attention to detail is truly unmatched. Will definitely be returning for my next vacation!"</p>
            <div class="author">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" alt="Sarah J.">
              <div>
                <strong>Taiga Salma</strong>
                <span>Agadir, Morocco</span>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="rating">★★★★★</div>
            <p>"The best hotel experience I've ever had. The staff went above and beyond to ensure our anniversary stay was absolutely perfect."</p>
            <div class="author">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" alt="Michael T.">
              <div>
                <strong>Hedda Mohamed</strong>
                <span>Yousoufia, Morocco</span>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="rating">★★★★★</div>
            <p>"A true sanctuary in the heart of the city. The amenities are world-class and the room was impeccably clean and comfortable."</p>
            <div class="author">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" alt="Emily R.">
              <div>
                <strong>Amira Hachmi</strong>
                <span>Tangier, Morocco</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: calc(100vh - 4.5rem);
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
      margin-top: -1px;
    }
    
    .hero-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(11, 25, 44, 0.65); /* 65% dark overlay */
      z-index: 1;
    }
    
    .hero-content {
      position: relative;
      z-index: 2;
      color: white;
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
    }
    
    .hero-badge {
      display: inline-block;
      padding: 0.6rem 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
    }
    
    .hero h1 {
      font-size: clamp(3rem, 6vw, 5.5rem);
      color: white;
      margin-bottom: 1.5rem;
      letter-spacing: -0.03em;
      text-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    .hero p {
      font-size: clamp(1.125rem, 2.5vw, 1.35rem);
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 3rem;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
      line-height: 1.7;
    }
    
    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    
    .btn-lg {
      padding: 1.125rem 3rem;
      font-size: 1.125rem;
      border-radius: var(--radius-full);
    }
    
    .btn-outline-light {
      background: transparent;
      border: 2px solid white;
      color: white;
    }
    .btn-outline-light:hover {
      background: white;
      color: var(--primary-color);
      transform: translateY(-2px);
    }
    
    /* Trust Section */
    .trust-section {
      background: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      padding: 2rem 0;
      position: relative;
      z-index: 10;
    }
    
    .trust-grid {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      gap: 2rem;
    }
    
    .trust-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .trust-icon {
      font-size: 2rem;
    }
    
    .trust-text {
      display: flex;
      flex-direction: column;
    }
    
    .trust-text strong {
      font-size: 1.1rem;
      color: var(--text-primary);
      line-height: 1.2;
    }
    
    .trust-text span {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    
    /* Features */
    .feature-card {
      background: var(--surface-color);
      padding: 3rem 2rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      border: 1px solid rgba(226, 232, 240, 0.5);
      text-align: center;
    }
    
    .feature-icon-lg {
      font-size: 3rem;
      margin-bottom: 1.5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 50%;
    }
    
    /* Rooms */
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
      height: 260px;
      overflow: hidden;
    }
    
    .room-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .room-card:hover .room-image {
      transform: scale(1.1);
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
    
    .room-content h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
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
    
    /* Testimonials */
    .testimonial-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 2.5rem;
      border-radius: var(--radius-lg);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .rating {
      color: var(--accent-color);
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .testimonial-card p {
      font-size: 1.1rem;
      font-style: italic;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    
    .author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .author img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .author strong {
      display: block;
      font-size: 1rem;
    }
    
    .author span {
      font-size: 0.85rem;
      color: #CBD5E1;
    }
    
    .choose-icon {
      font-size: 2rem;
      background: var(--background-color);
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
    }
    
    @media (max-width: 768px) {
      .hero { min-height: 80vh; }
      .hero-actions { flex-direction: column; width: 100%; padding: 0 2rem; }
      .ml-3 { margin-left: 0; }
      .trust-grid { flex-direction: column; gap: 1.5rem; align-items: flex-start; padding: 0 1rem; }
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
