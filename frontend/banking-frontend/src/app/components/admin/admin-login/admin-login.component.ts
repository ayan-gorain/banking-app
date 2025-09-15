import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  email:string=''
  password:string=''
  error:string=''
  loading:boolean=false

  constructor(private auth:AuthService, private router:Router) {}

  onSubmit(){
    this.loading = true
    this.error = ''
    this.auth.adminLogin(this.email, this.password).subscribe({
      next: (res) => {
        if(!res?.token){
          this.error = 'Login failed: no token returned'
          this.loading=false
          return
        }
        this.auth.setToken(res.token)
        this.auth.setUser(res.admin)
        this.loading=false
        this.router.navigateByUrl('/admin')
      },
      error: (err) => {
        this.error = err.message
        this.loading=false
      }
    })
  }
}
