import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { AccountRestService } from '../../../services/account-rest.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgForOf, CurrencyPipe],
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  accounts: any[] = [];
  fromAccountId: string = '';
  toAccountId: string = '';
  amount: number = 0;
  message = '';
  error = '';

  constructor(
    private accountservice: AccountService,
    private accountservicerest: AccountRestService
  ) {}

  ngOnInit(): void {
    this.accountservice.getAccounts().subscribe({
      next: (res) => {
        this.accounts = res;
      },
      error: (err) => {
        this.error = 'Failed to load accounts';
      }
    });
  }

  onTransfer() {
    if (this.fromAccountId === this.toAccountId) {
      this.error = 'Cannot transfer to the same account';
      this.message = '';
      return;
    }

    this.accountservicerest.transfer(this.fromAccountId, this.toAccountId, this.amount).subscribe({
      next: (res) => {
        this.message = res.message;
        this.error = '';
      },
      error: (err) => {
        this.error = err.error?.message || 'Transfer failed';
        this.message = '';
      }
    });
  }
}
