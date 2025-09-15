import gql from "graphql-tag";


export const bankAccountTypeDefs=gql`
 type BankAccount{
     id:ID!
     accountNumber:String!
     accountHolderName:String!
     balance:Float!
     createdAt:String
 }
 
 input BankAccountInput{
     accountHolderName:String!
     balance:Float
 }
 extend type Query{
     bankAccounts:[BankAccount!]!
     bankAccount(id:ID!):BankAccount
 }
 extend type Mutation{
     createBankAccount(input:BankAccountInput!):BankAccount
     updateBankAccount(id:ID!,input:BankAccountInput):BankAccount
     deleteBankAccount(id:ID!):Boolean
 }
 
 
 
 `