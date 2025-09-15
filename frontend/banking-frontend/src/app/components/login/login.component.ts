import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email:string=''
  password:string=''
  error:string=''
  loading:boolean=false

  constructor(private authservice:AuthService,private router:Router){}

  onSubmit():void{
    this.loading=true
    this.error=''

    this.authservice.login(this.email,this.password).subscribe({
      next:(res)=>{
        if(!res?.token){
          this.error = 'Login failed: no token returned'
          this.loading=false
          return
        }
        this.authservice.setToken(res.token)
        this.authservice.setUser(res.user)
        const role = this.authservice.getRole()
        this.loading=false
        if(role === 'admin'){
          this.router.navigateByUrl('/admin')
        } else {
          this.router.navigateByUrl('/accountlist')
        }
      },
      error:(err)=>{
        this.error=err.message
        this.loading=false
      }
    })
  }

}
