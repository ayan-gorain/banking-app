import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';
import { CreateAccountInput } from '../../../interface/userinterface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.css']
})
export class AccountCreateComponent {
  accountHolderName: string = '';
  balance: number = 0;
  error: string = '';

  constructor(private accountservice: AccountService, private router: Router, private auth: AuthService) {}

  ngOnInit(){
    const user = this.auth.getUser();
    this.accountHolderName = user?.name || '';
  }

  onSubmit() {
    const input: CreateAccountInput = {
      accountHolderName: this.accountHolderName,
      initialBalance: this.balance,
    } as any;

    this.error = '';
    this.accountservice.createAccount(input).subscribe({
      next: () => this.router.navigate(['/accountlist']),
      error: (err) => {
        const msg: string = err?.message || err?.graphQLErrors?.[0]?.message || 'Failed to create account';
        if (msg.includes('Account name already exists')) {
          this.error = 'Account name already exists for this user.';
        } else {
          this.error = msg;
        }
      }
    });
  }
}
