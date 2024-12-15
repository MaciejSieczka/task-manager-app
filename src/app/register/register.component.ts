import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        console.log('Registration successful');
        alert('User registered successfully');
        this.router.navigate(['/login']); // Przekierowanie do logowania
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Error registering user');
      }
    });
  }
}
