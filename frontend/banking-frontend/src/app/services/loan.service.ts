import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private baseUrl='http://localhost:3000/api/accounts';

  constructor(private http:HttpClient, private auth: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getLoans():Observable<any>{
    return this.http.get(`${this.baseUrl}/loan`, { headers: this.getAuthHeaders() });
  }
  createLoan(data:{accountId:string;amount:number;interestRate:number;termMonths:number;}):Observable<any>{
    return this.http.post(`${this.baseUrl}/loan`, data, { headers: this.getAuthHeaders() });
  }
  repayLoan(loanId:string,data:{amount:number}):Observable<any>{
    return this.http.post(`${this.baseUrl}/loan/${loanId}/repay`, data, { headers: this.getAuthHeaders() });
  }

  deleteLoan(loadId:string):Observable<any>{
    return this.http.delete(`${this.baseUrl}/loan/${loadId}`, { headers: this.getAuthHeaders() });
  }

  approveLoan(loanId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/loan/${loanId}/approve`, {}, { headers: this.getAuthHeaders() });
  }
}
