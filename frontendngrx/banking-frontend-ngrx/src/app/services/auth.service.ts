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
const SIGNUP_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput) {
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
  constructor(private apollo:Apollo) {}

  login(email:string,password:string):Observable<any>{
    return this.apollo.mutate<any>({
      mutation:LOGIN_MUTATION,
      variables:{email,password},
    }as any).pipe(map(res=>res.data.login))
  } 
  signup(input:any):Observable<any>{
    return this.apollo.mutate<any>({
      mutation:SIGNUP_MUTATION,
      variables:{input},
    }as any).pipe(map(res=>res.data.createUser))
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

  setUser(user:any):void{
    try{
      localStorage.setItem('authUser',JSON.stringify(user))
      
    }
    catch{
      
    }
  }
  getUser():any|null{
    try {
      const raw=localStorage.getItem('authUser');
      return raw ? JSON.parse(raw) : null;
      
    } catch (error) {
      return null;
      
    }
  }

  logout():void{
    this.clearToken()
    localStorage.removeItem('authUser')
  }
}
