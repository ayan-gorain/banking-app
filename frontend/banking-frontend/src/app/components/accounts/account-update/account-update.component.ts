import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { FormsModule } from "@angular/forms";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-account-update',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.css']
})
export class AccountUpdateComponent {
  accountId: string = '';
  accountNumber: string = '';
  accountHolderName: string = '';
  balance: number = 0;
  error: string = '';

  constructor(
    private activeroute: ActivatedRoute,
    private router: Router,
    private accountservice: AccountService
  ) {}

  ngOnInit() {
    this.accountId = this.activeroute.snapshot.paramMap.get('id') || '';

    this.accountservice.getAccount(this.accountId).subscribe({
      next: (res) => {
        if (res) {
          this.accountNumber = res.accountNumber;
          this.accountHolderName = res.accountHolderName;
          this.balance = res.balance ?? 0;
        } else {
          this.error = 'Account not found';
        }
      },
      error: (err) => (this.error = err.message)
    });
  }

  onSubmit() {
    const input = {
      accountNumber: this.accountNumber,
      accountHolderName: this.accountHolderName,
      balance: this.balance
    };

    this.accountservice.updateAccount(this.accountId, input).subscribe({
      next: () => this.router.navigate(['/accountlist']),
      error: (err) => (this.error = err.message || 'Failed to update account')
    });
  }
}
