export interface BankAccount {
  id: string;
  accountNumber: string;
  accountHolderName: string;
  balance: number;
  createdAt: string;
}

export interface CreateAccountInput {
  accountNumber: string;
  accountHolderName: string;
  initialBalance?: number;
}

export interface CreateAccountResponse {
  createBankAccount: BankAccount;
}

export interface GetAccountsResponse {
  bankAccounts: BankAccount[];
}

export interface GetAccountResponse {
  bankAccount: BankAccount;
}
export interface UpdateAccountInput {
  accountNumber: string;
  accountHolderName: string;
  balance: number;
}
