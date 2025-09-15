import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AccountListComponent } from "./components/accounts/account-list/account-list.component";
import { SignupComponent } from "./components/signup/signup.component";
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'banking-frontend';
  constructor(private auth: AuthService, private router: Router, private location: Location) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.auth.getRole() === 'admin';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  back(): void {
    this.location.back();
  }
}

