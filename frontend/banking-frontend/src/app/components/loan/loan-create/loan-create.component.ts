import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';          // For ngModel
import { CommonModule, NgIf, NgFor } from '@angular/common'; // For *ngIf and *ngFor
import { LoanService } from '../../../services/loan.service';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../interface/Accounts';
import { BankAccount } from '../../../interface/userinterface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-loan-create',
  standalone: true, // standalone component
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './loan-create.component.html',
  styleUrls: ['./loan-create.component.css'],
})
export class LoanCreateComponent {
  accounts: Account[] = [];
  accountId: string = '';
  amount: number = 0;
  interestRate: number = 5;
  termMonths: number = 12;

  message: string = '';
  error: string = '';
  currentUserName: string = '';
  loading: boolean = true;

  constructor(
    private loanservice: LoanService,
    private accountservices: AccountService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // Get logged-in user via AuthService (uses 'authUser' key)
    const user = this.auth.getUser();
    this.currentUserName = user?.name ?? '';

    // Fetch accounts from service
    this.accountservices.getAccounts().subscribe({
      next: (res: BankAccount[]) => {
        // Map BankAccount to Account interface
        this.accounts = res
          .map(acc => ({
            _id: acc.id,
            accountNumber: acc.accountNumber,
            accountHolderName: acc.accountHolderName,
            balance: acc.balance,
          }))
          .filter(acc => acc.accountHolderName === this.currentUserName);

        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load accounts';
        this.loading = false;
      }
    });
  }

  createLoan() {
    // Validate inputs
    if (!this.accountId || this.amount <= 0 || this.termMonths <= 0) {
      this.error = 'Please fill the field correctly';
      this.message = '';
      return;
    }

    this.loanservice.createLoan({
      accountId: this.accountId,
      amount: this.amount,
      interestRate: this.interestRate,
      termMonths: this.termMonths,
    }).subscribe({
      next: () => {
        this.message = 'Loan request submitted. Waiting for admin approval.';
        this.error = '';
        this.accountId = '';
        this.amount = 0;
        this.interestRate = 5;
        this.termMonths = 12;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to create loan';
        this.message = '';
      }
    });
  }
}
