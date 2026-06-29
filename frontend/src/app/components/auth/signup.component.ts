import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-signup',
  template: `
    <div class="container">
      <h2>🏨 Create Account</h2>
      <form (ngSubmit)="signup()">
        <div class="form-group">
          <label>Name</label>
          <input id="signup-name" type="text" name="name" [(ngModel)]="user.name" placeholder="Enter your name" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input id="signup-email" type="email" name="email" [(ngModel)]="user.email" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input id="signup-password" type="password" name="password" [(ngModel)]="user.password" placeholder="Create a password" required />
        </div>
        <button id="signup-btn" type="submit">Sign Up</button>
      </form>
      <p *ngIf="successMsg" class="success">{{ successMsg }}</p>
      <p *ngIf="errorMsg" class="error">{{ errorMsg }}</p>
      <p>Already have an account? <a routerLink="/">Login</a></p>
    </div>
  `,
  styles: [`
    .container { max-width: 400px; margin: 80px auto; padding: 30px; border: 1px solid #ddd; border-radius: 8px; }
    h2 { text-align: center; margin-bottom: 20px; }
    .form-group { margin-bottom: 15px; display: flex; flex-direction: column; }
    label { margin-bottom: 5px; font-weight: bold; }
    input { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
    button { width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
    button:hover { background: #1e7e34; }
    .success { color: green; text-align: center; }
    .error { color: red; text-align: center; }
    p { text-align: center; margin-top: 15px; }
  `]
})
export class SignupComponent {
  user: User = { name: '', email: '', password: '', role: 'USER' };
  successMsg = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    this.successMsg = '';
    this.errorMsg = '';
    this.authService.signup(this.user).subscribe({
      next: () => {
        this.successMsg = 'Account created! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: () => {
        this.errorMsg = 'Signup failed. Please try again.';
      }
    });
  }
}