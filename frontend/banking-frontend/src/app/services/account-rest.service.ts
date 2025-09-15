import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransctionResponse } from '../interface/transtion';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountRestService {

  private baseurl='http://localhost:3000/api/accounts'

  constructor(private http:HttpClient, private auth:AuthService) { }

  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseurl}`, { headers: this.authHeaders() });
  }

  deposit(accountId:string,amount:number):Observable<TransctionResponse>{
    return this.http.post<TransctionResponse>(`${this.baseurl}/${accountId}/deposit`,{amount}, { headers: this.authHeaders() })
  }
  withdraw(accountId:string,amount:number):Observable<TransctionResponse>{
    return this.http.post<TransctionResponse>(`${this.baseurl}/${accountId}/withdraw`,{amount}, { headers: this.authHeaders() })
  }
  transfer(fromAccountId:string,toAccountId:string,amount:number):Observable<TransctionResponse>{
    return this.http.post<TransctionResponse>(`${this.baseurl}/transfer`,{fromAccountId,toAccountId,amount}, { headers: this.authHeaders() })
  }

  getAccount(accountId:string):Observable<any>{
    return this.http.get(`${this.baseurl}/${accountId}`, { headers: this.authHeaders() })
  }
  deleteAccount(accountId:string):Observable<any>{
    return this.http.delete(`${this.baseurl}/${accountId}`, { headers: this.authHeaders() })
  }

  
}
