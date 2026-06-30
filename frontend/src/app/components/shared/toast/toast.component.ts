import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService, Toast } from '../../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts; let i = index" 
           class="toast toast-{{ toast.type }} slide-in">
        <span>{{ toast.message }}</span>
        <button class="toast-close" (click)="remove(i)">&times;</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .toast {
      min-width: 300px;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      font-weight: 500;
      backdrop-filter: blur(8px);
    }
    
    .toast-success { background-color: rgba(16, 185, 129, 0.95); }
    .toast-error { background-color: rgba(239, 68, 68, 0.95); }
    .toast-info { background-color: rgba(0, 113, 194, 0.95); }
    
    .toast-close {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity var(--transition-fast);
      margin-left: 1rem;
    }
    
    .toast-close:hover {
      opacity: 1;
    }
    
    .slide-in {
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private sub?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toastState.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => {
        // Remove the first item since it's the oldest (FIFO)
        if (this.toasts.length > 0) {
          this.remove(0);
        }
      }, 4000);
    });
  }

  remove(index: number) {
    this.toasts.splice(index, 1);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
