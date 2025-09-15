import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../../services/loan.service';
import { NgIf, NgForOf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [NgIf, NgForOf, FormsModule, RouterLink, NgClass],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  loans: any[] = [];
  loading = true;
  error: string = '';

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loading = true;
    this.loanService.getLoans().subscribe({
      next: (loans: any[]) => {
        this.loans = loans || [];
        this.loading = false;
        this.error = '';
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to load loans';
        this.loading = false;
      }
    });
  }

  deleteLoan(loanId: string) {
    this.loanService.deleteLoan(loanId).subscribe({
      next: () => {
        this.loans = this.loans.filter(l => (l._id || l.id) !== loanId);
      },
      error: () => alert('Failed to delete loan')
    });
  }

  repayLoan(loan: any) {
    const amount = Number(loan.repayAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (typeof loan.balanceRemaining === 'number' && amount > loan.balanceRemaining) {
      alert('Repayment exceeds balance remaining');
      return;
    }

    const loanId = String(loan._id ?? loan.id ?? loan.loanId);
    this.loanService.repayLoan(loanId, { amount }).subscribe({
      next: (resp: any) => {
        if (resp?.closed) {
          this.loans = this.loans.filter(l => ((l._id || l.id) !== (resp.loanId || loanId)));
        } else {
          const updated = resp?.loan || resp;
          this.loans = this.loans.map(l => ((l._id || l.id) === loanId ? updated : l));
        }
        loan.repayAmount = 0;
      },
      error: (err) => {
        console.error('Repay error', err);
        alert(err?.error?.message || err?.message || 'Failed to repay loan');
      }
    });
  }
}
