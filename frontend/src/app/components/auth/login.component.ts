import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2 class="auth-title">Welcome Back</h2>
        <p class="auth-subtitle">Sign in to your LuxeStay account</p>
        
        <form [formGroup]="loginForm" (ngSubmit)="login()">
          <div class="form-group">
            <label class="form-label" for="login-email">Email Address</label>
            <input id="login-email" type="email" class="form-control" formControlName="email" placeholder="name@example.com" />
            <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="error-message">
              Please enter a valid email.
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <input id="login-password" type="password" class="form-control" formControlName="password" placeholder="••••••••" />
            <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="error-message">
              Password is required.
            </div>
          </div>
          
          <div *ngIf="errorMsg" class="error-message auth-error">
            {{ errorMsg }}
          </div>
          
          <button id="login-btn" type="submit" class="btn btn-primary btn-full" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 12rem);
      padding: 2rem 1rem;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 2.5rem;
    }
    .auth-title {
      font-size: 1.75rem;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      text-align: center;
    }
    .auth-subtitle {
      color: var(--text-secondary);
      text-align: center;
      margin-bottom: 2rem;
    }
    .btn-full {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      margin-top: 1rem;
    }
    .auth-error {
      text-align: center;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: rgba(239, 68, 68, 0.1);
      border-radius: var(--radius-sm);
    }
    .auth-footer {
      margin-top: 2rem;
      text-align: center;
      color: var(--text-secondary);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;
    
    this.errorMsg = '';
    this.isLoading = true;
    
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        // Check redirect url or go to rooms
        const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/rooms';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.message || 'Invalid email or password.';
      }
    });
  }
}
