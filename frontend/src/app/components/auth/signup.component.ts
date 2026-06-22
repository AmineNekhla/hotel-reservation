import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component{
    {
        selector: 'app-signup',
            template: `
    <h2>Signup</h2>

    <form (ngSubmit)="signup()">
        <input type="text" name="name" [(ngModel)]="user.name" placeholder="Name" required>
        <input type="email" name="email" [(ngModel)]="user.email" placeholder="Email" required>
        <input type="password" name="password" [(ngModel)]="user.password" placeholder="Password required>
        <button type="submit">Signup</button>
    </form>
    `
    }
}

export class SignupComponent {
    user: User = {
        name: '',
        email: '',
        password: '',
        role: 'User'
    };
    constructor(private authService: AuthService) { }

    signup() {
        this.authService.signup(this.user).subscribe({
            next: () => alert('Account created successfully'),
            error: () => alert('Signup failed')
        });
    }
}