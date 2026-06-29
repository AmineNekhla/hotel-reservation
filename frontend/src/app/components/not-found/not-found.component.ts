import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="container not-found-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <a routerLink="/" class="btn btn-primary">Return to Home</a>
    </div>
  `,
  styles: [`
    .not-found-container {
      text-align: center;
      padding: 6rem 0;
    }
    h1 {
      font-size: 6rem;
      color: var(--secondary-color);
      margin-bottom: 0;
    }
    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }
  `]
})
export class NotFoundComponent {

}
