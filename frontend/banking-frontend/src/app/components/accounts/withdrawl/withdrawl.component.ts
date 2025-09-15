import { Component } from '@angular/core';
import { AccountRestService } from '../../../services/account-rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-withdrawl',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, CommonModule],
  templateUrl: './withdrawl.component.html',
  styleUrls: ['./withdrawl.component.css']
})
export class WithdrawlComponent {
 accounts: any[] = [];
  selectedAccountId = '';
  amount = 0;
  message = '';
  error = '';
  hasRouteId = false;

  constructor(
    private accountService: AccountRestService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

  onWithdraw() {
    const targetId = this.selectedAccountId || (this.accounts[0]?._id || this.accounts[0]?.id || '');
    if (!targetId) {
      this.error = 'No account selected';
      this.message = '';
      return;
    }

    this.accountService.withdraw(targetId, this.amount).subscribe({
      next: (res) => {
        this.message = res.message;
        this.error = '';
        this.router.navigate(['/accountlist']); // Navigate back after withdrawal
      },
      error: (err) => {
        this.error = err.error?.message || 'Withdrawal failed';
        this.message = '';
      }
    });
  }

}
