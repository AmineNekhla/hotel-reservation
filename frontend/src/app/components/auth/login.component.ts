import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container">
      <h2>🏨 Hotel Login</h2>
      <form (ngSubmit)="login()">
        <div class="form-group">
          <label>Email</label>
          <input id="login-email" type="email" name="email" [(ngModel)]="email" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input id="login-password" type="password" name="password" [(ngModel)]="password" placeholder="Enter your password" required />
        </div>
        <button id="login-btn" type="submit">Login</button>
      </form>
      <p *ngIf="errorMsg" class="error">{{ errorMsg }}</p>
      <p>Don't have an account? <a routerLink="/signup">Sign up</a></p>
    </div>
  `,
  styles: [`
    .container { max-width: 400px; margin: 80px auto; padding: 30px; border: 1px solid #ddd; border-radius: 8px; }
    h2 { text-align: center; margin-bottom: 20px; }
    .form-group { margin-bottom: 15px; display: flex; flex-direction: column; }
    label { margin-bottom: 5px; font-weight: bold; }
    input { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
    button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
    button:hover { background: #0056b3; }
    .error { color: red; text-align: center; }
    p { text-align: center; margin-top: 15px; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMsg = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (user.password === this.password) {
          this.authService.saveUser(user);
          this.router.navigate(['/rooms']);
        } else {
          this.errorMsg = 'Invalid email or password.';
        }
      },
      error: () => {
        this.errorMsg = 'Invalid email or password.';
      }
    });
  }
}
