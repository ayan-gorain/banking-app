import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoanService } from '../../../services/loan.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  users: any[] = [];
  accounts: any[] = [];
  accountsByUser: Record<string, any[]> = {};
  loans: any[] = [];
  loansByUser: Record<string, any[]> = {};
  loading = true;
  error = '';
  private gqlUrl = 'http://localhost:3000/graphql';
  private restAccountsUrl = 'http://localhost:3000/api/accounts';
  private restLoansUrl = 'http://localhost:3000/api/accounts/loan';

  constructor(private http: HttpClient, private auth: AuthService, private loanService: LoanService) {}

  ngOnInit(){
    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });

    const usersQuery = {
      query: `query { users { id name email role createdAt } }`,
      variables: {}
    } as const;

    let usersLoaded = false;
    let accountsLoaded = false;
    let loansLoaded = false;

    const finish = () => {
      if (usersLoaded && accountsLoaded && loansLoaded) {
        this.groupAccounts();
        this.groupLoans();
        this.loading = false;
      }
    };

    this.http.post<any>(this.gqlUrl, usersQuery, { headers }).subscribe({
      next: (res) => { this.users = res.data?.users || []; usersLoaded = true; finish(); },
      error: (err) => { this.error = err.error?.errors?.[0]?.message || err.message; this.loading = false; }
    });

    this.http.get<any[]>(this.restAccountsUrl, { headers }).subscribe({
      next: (data) => { this.accounts = data || []; accountsLoaded = true; finish(); },
      error: (err) => { this.error = err.error?.message || err.message; this.loading = false; }
    });

    this.loanService.getLoans().subscribe({
      next: (loans) => { this.loans = loans || []; loansLoaded = true; finish(); },
      error: (err) => { this.error = err?.error?.message || err?.message; this.loading = false; }
    });
  }

  private groupAccounts(){
    const grouped: Record<string, any[]> = {};
    for (const acc of this.accounts) {
      const userId = (acc.userId && (acc.userId._id || acc.userId)) || acc.userId;
      if (!grouped[userId]) grouped[userId] = [];
      grouped[userId].push(acc);
    }
    this.accountsByUser = grouped;
  }

  private groupLoans(){
    const grouped: Record<string, any[]> = {};
    for (const loan of this.loans) {
      const userId =
        loan.accountId?.userId?._id ||
        loan.accountId?.userId ||
        loan.userId?._id ||
        loan.userId;
      if (!grouped[userId]) grouped[userId] = [];
      grouped[userId].push(loan);
    }
    this.loansByUser = grouped;
  }

  approve(loan: any){
    const loanId = loan._id || loan.id;
    this.loanService.approveLoan(loanId).subscribe({
      next: (resp) => {
        const updated = resp?.loan || resp;
        this.loans = this.loans.map(l => ((l._id || l.id) === loanId ? updated : l));
        this.groupLoans();
      },
      error: (err) => alert(err?.error?.message || err?.message || 'Failed to approve loan')
    });
  }
}
