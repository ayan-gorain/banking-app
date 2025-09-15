import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountRestService } from '../../../services/account-rest.service';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-deposit',
  standalone: true,   // make it standalone if using imports
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {
  accounts: any[] = [];
  selectedAccountId = '';
  amount = 0;
  message = '';
  error = '';
  hasRouteId = false;

  constructor(private accountService: AccountRestService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      this.hasRouteId = true;
      this.selectedAccountId = routeId;
      
      this.accountService.getAccount(routeId).subscribe({
        next: (acc: any) => {
          this.accounts = acc ? [acc] : [];
          if (!acc) {
            this.error = 'Account not found';
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load account';
        }
      });
    } else {
      
      this.accountService.getAccounts().subscribe({
        next: (accounts) => {
          this.accounts = accounts || [];
          if (this.accounts.length === 1) {
            this.selectedAccountId = this.accounts[0]._id || this.accounts[0].id;
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load accounts';
        }
      });
    }
  }

  onDeposit() {
    const targetId = this.selectedAccountId || (this.accounts[0]?._id || this.accounts[0]?.id || '');
    if (!targetId) {
      this.error = 'No account selected';
      this.message = '';
      return;
    }
    this.accountService.deposit(targetId, this.amount).subscribe({
      next: (res) => {
        this.message = res.message;
        this.error = '';
        // Navigate back to account list so it refreshes with network-only fetch
        this.router.navigate(['/accountlist']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Deposit failed';
        this.message = '';
      }
    });
  }
}
