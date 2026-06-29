import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2 class="auth-title">Create Account</h2>
        <p class="auth-subtitle">Join LuxeStay for exclusive offers</p>
        
        <form [formGroup]="signupForm" (ngSubmit)="signup()">
          <div class="form-group">
            <label class="form-label" for="signup-name">Full Name</label>
            <input id="signup-name" type="text" class="form-control" formControlName="name" placeholder="John Doe" />
            <div *ngIf="signupForm.get('name')?.touched && signupForm.get('name')?.invalid" class="error-message">
              Name is required.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-email">Email Address</label>
            <input id="signup-email" type="email" class="form-control" formControlName="email" placeholder="name@example.com" />
            <div *ngIf="signupForm.get('email')?.touched && signupForm.get('email')?.invalid" class="error-message">
              Please enter a valid email.
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="signup-phone">Phone Number</label>
            <input id="signup-phone" type="text" class="form-control" formControlName="phone" placeholder="+1 234 567 8900" />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="signup-password">Password</label>
            <input id="signup-password" type="password" class="form-control" formControlName="password" placeholder="Create a strong password" />
            <div *ngIf="signupForm.get('password')?.touched && signupForm.get('password')?.invalid" class="error-message">
              Password must be at least 6 characters.
            </div>
          </div>
          
          <div *ngIf="errorMsg" class="error-message auth-error">
            {{ errorMsg }}
          </div>
          
          <button id="signup-btn" type="submit" class="btn btn-primary btn-full" [disabled]="signupForm.invalid || isLoading">
            {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
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
export class SignupComponent {
  signupForm: FormGroup;
  errorMsg = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  signup() {
    if (this.signupForm.invalid) return;
    
    this.errorMsg = '';
    this.isLoading = true;
    
    this.authService.signup(this.signupForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/rooms']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.message || 'Signup failed. Please try again.';
      }
    });
  }
}