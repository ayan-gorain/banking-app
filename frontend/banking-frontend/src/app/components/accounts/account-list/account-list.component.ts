import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountRestService } from '../../../services/account-rest.service';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent {
  accounts: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private accountservice: AccountRestService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountservice.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || err.message;
        this.loading = false;
      }
    });
  }

  deleteAccount(id: string): void {
    if (!confirm('Are you sure you want to delete the account?')) return;

    this.accountservice.deleteAccount(id).subscribe({
      next: () => {
        this.accounts = this.accounts.filter(acc => (acc._id || acc.id) !== id);
      },
      error: (err) => {
        alert('Failed to delete account: ' + (err.error?.message || err.message));
      }
    });
  }
}
