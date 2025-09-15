import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
        createdAt
      }
    }
  }
`;
const ADMIN_LOGIN_MUTATION = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      token
      admin {
        id
        name
        email
        role
        createdAt
      }
    }
  }
`;
const REGISTER_MUTATAION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      createdAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  login(email: string, password: string): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: LOGIN_MUTATION,
        variables: { email, password },
      } as any)
      .pipe(map((res) => res.data.login));
  }

  adminLogin(email: string, password: string): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: ADMIN_LOGIN_MUTATION,
        variables: { email, password },
      } as any)
      .pipe(map((res) => res.data.adminLogin));
  }

  register(input:any): Observable<any> {
    return this.apollo
      .mutate<any>({
        mutation: REGISTER_MUTATAION,
        variables: { input },
      } as any)
      .pipe(map((res) => res.data.createUser));
  }

  setToken(token:string):void{
    localStorage.setItem('authToken',token)
  }
  getToken():string|null{
    return localStorage.getItem('authToken')
  }
  clearToken():void{
    localStorage.removeItem('authToken')
  }

  setUser(user: any): void {
    try {
      localStorage.setItem('authUser', JSON.stringify(user));
    } catch {}
  }

  getUser(): any | null {
    try {
      const raw = localStorage.getItem('authUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const user = this.getUser();
    const role = user?.role ?? null;
    return typeof role === 'string' ? role.toLowerCase() : role;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.clearToken();
    localStorage.removeItem('authUser');
  }
}
