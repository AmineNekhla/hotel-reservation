import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="spinner-container" *ngIf="loading">
      <div class="spinner"></div>
      <p *ngIf="message" class="spinner-text">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(0, 113, 194, 0.15);
      border-radius: 50%;
      border-top-color: var(--secondary-color);
      animation: spin 1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
    }
    .spinner-text {
      margin-top: 1.25rem;
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 1.125rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() loading: boolean = false;
  @Input() message: string = '';
}
