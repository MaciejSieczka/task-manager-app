import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}
  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (token) => {
        console.log('Login successful, token:', token);
        localStorage.setItem('token', token); 
        this.authService.setAuthenticated(true);
        this.router.navigate(['/tasks']); 
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid username or password');
      }
    });
  }

}
