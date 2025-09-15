import { Routes, CanMatchFn, Router } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AccountListComponent } from './components/accounts/account-list/account-list.component';
import { AccountCreateComponent } from './components/accounts/account-create/account-create.component';
import { AccountUpdateComponent } from './components/accounts/account-update/account-update.component';
import { DepositComponent } from './components/accounts/deposit/deposit.component';
import { WithdrawlComponent } from './components/accounts/withdrawl/withdrawl.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { TransferComponent } from './components/accounts/transfer/transfer.component';
import { LoanListComponent } from './components/loan/loan-list/loan-list.component';
import { LoanCreateComponent } from './components/loan/loan-create/loan-create.component';

const authGuard: CanMatchFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isLoggedIn()) return true;
    router.navigate(['/login']);
    return false;
};

const adminGuard: CanMatchFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isLoggedIn() && auth.getRole() === 'admin') return true;
    router.navigate(['/admin/login']);
    return false;
};

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },

    // Customer routes
    { path: 'accountlist', component: AccountListComponent, canMatch: [authGuard] },
    { path: 'createaccount', component: AccountCreateComponent, canMatch: [authGuard] },
    { path: 'updateaccount/:id', component: AccountUpdateComponent, canMatch: [authGuard] },
    { path: 'deposits', component: DepositComponent, canMatch: [authGuard] },
    { path: 'deposits/:id', component: DepositComponent, canMatch: [authGuard] },
    { path: 'withdrawl', component: WithdrawlComponent, canMatch: [authGuard] },
    { path: 'withdrawl/:id', component: WithdrawlComponent, canMatch: [authGuard] },
    { path: 'transfer', component: TransferComponent, canMatch: [authGuard] },
    //Loan Routes
    { path: 'loanlist', component: LoanListComponent, canMatch: [authGuard] },
    { path: 'loancreate', component: LoanCreateComponent, canMatch: [authGuard] },
    // Admin routes
    { path: 'admin/login', component: AdminLoginComponent },
    { path: 'admin', component: AdminDashboardComponent, canMatch: [adminGuard] },
];
