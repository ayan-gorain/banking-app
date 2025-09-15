import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,         
  imports: [FormsModule, NgIf,RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']  
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(private authservice: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    const input = { name: this.name, email: this.email, password: this.password };

    this.authservice.register(input).subscribe({
      next: (res) => {
        alert('Signup successful');
        this.loading = false;
        this.name = '';
        this.email = '';
        this.password = '';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

}
