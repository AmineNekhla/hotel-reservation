import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container" style="max-width: 450px; margin: 4rem auto;">
      <div class="card p-4">
        <div class="text-center mb-4">
          <div class="mb-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--secondary-color)"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          </div>
          <h2>Welcome Back</h2>
          <p class="text-muted">Sign in to manage your bookings</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" formControlName="email" [class.is-invalid]="submitted && f['email'].errors" placeholder="name@example.com" />
            <div *ngIf="submitted && f['email'].errors" class="error-message">
              <span *ngIf="f['email'].errors['required']">Email is required</span>
              <span *ngIf="f['email'].errors['email']">Email must be a valid email address</span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" formControlName="password" [class.is-invalid]="submitted && f['password'].errors" placeholder="Enter your password" />
            <div *ngIf="submitted && f['password'].errors" class="error-message">
              <span *ngIf="f['password'].errors['required']">Password is required</span>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block mt-4" [disabled]="loading" style="height: 48px;">
            <span *ngIf="loading">Signing in...</span>
            <span *ngIf="!loading">Sign In</span>
          </button>
        </form>
        
        <p class="text-center mt-4 text-muted">
          Don't have an account? <a routerLink="/signup" style="font-weight: 600;">Register here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .p-4 { padding: 2.5rem 2rem; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private authService: AuthService,
    private toast: ToastService
  ) {
    if (this.authService.isLoggedIn()) {
      this.route.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login({ email: this.f['email'].value, password: this.f['password'].value })
      .subscribe({
        next: () => {
          this.toast.showSuccess('Successfully signed in. Welcome back!');
          this.route.navigate(['/']);
        },
        error: error => {
          this.toast.showError(error.error?.message || 'Invalid email or password. Please try again.');
          this.loading = false;
        }
      });
  }
}
