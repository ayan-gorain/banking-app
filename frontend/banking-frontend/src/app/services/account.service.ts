import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { 
  BankAccount, 
  CreateAccountInput, 
  CreateAccountResponse, 
  GetAccountsResponse, 
  GetAccountResponse, 
  UpdateAccountInput
} from '../interface/userinterface';


const GET_ACCOUNTS = gql`
  query {
    bankAccounts {
      id
      accountNumber
      accountHolderName
      balance
      createdAt
    }
  }
`;
const GET_ACCOUNT_BY_ID = gql`
  query ($id: ID!) {
    bankAccount(id: $id) {
      id
      accountNumber
      accountHolderName
      balance
      createdAt
    }
  }
`;
const CREATE_ACCOUNT = gql`
  mutation ($input: BankAccountInput!) {
    createBankAccount(input: $input) {
      id
      accountNumber
      accountHolderName
      balance
      createdAt
    }
  }
`;
const UPDATE_ACCOUNT = gql`
  mutation ($id:ID!,$input: BankAccountInput!) {
    updateBankAccount(id:$id,input: $input) {
      id
      accountNumber
      accountHolderName
      balance
      createdAt
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation ($id: ID!) {
    deleteBankAccount(id: $id)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private apollo: Apollo) {}

  getAccounts(): Observable<BankAccount[]> {
    return this.apollo
      .query<GetAccountsResponse>({
        query: GET_ACCOUNTS,
        fetchPolicy: 'network-only'
      })
      .pipe(map((res) => (res.data?.bankAccounts || []) as BankAccount[]));
  }

  getAccount(id: string): Observable<BankAccount | null> {
    return this.apollo
      .query<GetAccountResponse>({
        query: GET_ACCOUNT_BY_ID,
        variables: { id },
      })
      .pipe(map((res) => res.data?.bankAccount as BankAccount || null));
  }

  createAccount(input: CreateAccountInput): Observable<BankAccount> {
    const backendInput = {
      accountHolderName: input.accountHolderName,
      balance: input.initialBalance ?? 0,
    } as const;

    return this.apollo.mutate<any>({
      mutation: CREATE_ACCOUNT,
      variables: { input: backendInput }
    } as any).pipe(
      map((res) => res.data.createBankAccount as BankAccount)
    );
  }
  updateAccount(id:string,input: UpdateAccountInput): Observable<BankAccount> {
    const backendInput = {
      accountNumber: input.accountNumber,
      accountHolderName: input.accountHolderName,
      balance: input.balance,
    } as const;

    return this.apollo.mutate<any>({
      mutation: UPDATE_ACCOUNT,
      variables: { id,input: backendInput }
    } as any).pipe(
      map((res) => res.data!.updateBankAccount)
    );
  }

  deleteAccount(id: string): Observable<boolean> {
    return this.apollo.mutate<any>({
      mutation: DELETE_ACCOUNT,
      variables: { id }
    } as any).pipe(
      map((res) => res.data.deleteBankAccount as boolean)
    );
  }

}
