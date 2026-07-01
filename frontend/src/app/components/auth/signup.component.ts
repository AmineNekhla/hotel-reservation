import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  template: `
    <div class="container" style="max-width: 450px; margin: 4rem auto;">
      <div class="card p-4">
        <div class="text-center mb-4">
          <div class="mb-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--secondary-color)"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          </div>
          <h2>Create Account</h2>
          <p class="text-muted">Join LuxeStay to start booking today</p>
        </div>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" formControlName="name" [class.is-invalid]="submitted && f['name'].errors" placeholder="Alaoui Mohamed" />
            <div *ngIf="submitted && f['name'].errors" class="error-message">
              <span *ngIf="f['name'].errors['required']">Name is required</span>
            </div>
          </div>
          
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
            <input type="password" class="form-control" formControlName="password" [class.is-invalid]="submitted && f['password'].errors" placeholder="Create a strong password" />
            <div *ngIf="submitted && f['password'].errors" class="error-message">
              <span *ngIf="f['password'].errors['required']">Password is required</span>
              <span *ngIf="f['password'].errors['minlength']">Password must be at least 6 characters</span>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block mt-4" [disabled]="loading" style="height: 48px;">
            <span *ngIf="loading">Creating Account...</span>
            <span *ngIf="!loading">Create Account</span>
          </button>
        </form>
        
        <p class="text-center mt-4 text-muted">
          Already have an account? <a routerLink="/login" style="font-weight: 600;">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .p-4 { padding: 2.5rem 2rem; }
  `]
})
export class SignupComponent {
  signupForm: FormGroup;
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

    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    
    const user = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: 'GUEST'
    };

    this.authService.signup(user)
      .subscribe({
        next: () => {
          this.toast.showSuccess('Registration successful. Please log in.');
          this.route.navigate(['/login']);
        },
        error: error => {
          this.toast.showError(error.error?.message || 'Registration failed. Please try again.');
          this.loading = false;
        }
      });
  }
}