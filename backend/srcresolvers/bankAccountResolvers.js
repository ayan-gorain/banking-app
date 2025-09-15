import BankAccount from "../models/bankAccount.js";
import { v4 as uuidv4 } from "uuid";

export const bankAccountResolvers={
    Query:{
        bankAccounts:async(_,__,{user:authUser})=>{
            if(!authUser) throw new Error("Authentication required")
            return await BankAccount.find()
        },
        bankAccount:async(_,{id},{user:authUser})=>{
            if(!authUser) throw new Error("Authentication required");
            return await BankAccount.findById(id);
        }
    },
    Mutation:{
        createBankAccount:async(_,{input},{user:authUser})=>{
            if(!authUser) throw new Error("Authentication required");

            // Enforce unique accountHolderName per user
            const existingSameName = await BankAccount.findOne({ userId: authUser.userId, accountHolderName: input.accountHolderName });
            if (existingSameName) {
                throw new Error("Account name already exists for this user.");
            }

            // Enforce: if user has existing accounts, at least one must have a transaction before creating another
            const existingAccounts = await BankAccount.find({ userId: authUser.userId });
            if (existingAccounts.length > 0) {
                const hasTransactions = existingAccounts.some(acc => acc.transactions && acc.transactions.length > 0);
                if (!hasTransactions) {
                    throw new Error("Cannot create new account. Please complete at least one transaction in your existing account(s) before creating a new one.");
                }
            }

            const newAccount=new BankAccount({
                accountNumber: uuidv4(),
                accountHolderName: input.accountHolderName,
                balance: input.balance ?? 0,
                userId: authUser.userId,
            })
            try {
                return await newAccount.save()
            } catch (error) {
                if (error && error.code === 11000) {
                    throw new Error("Account name already exists for this user.");
                }
                throw error;
            }
            
        },
        updateBankAccount:async(_,{id,input},{user:authUser})=>{
            if(!authUser) throw new Error("Authentication required");

            // Behave like create when the document does not exist (upsert)
            // Ensure newly created documents are linked to the authenticated user
            const updatedAccount = await BankAccount.findByIdAndUpdate(
                id,
                {
                    $set: {
                        accountHolderName: input?.accountHolderName,
                        balance: input?.balance,
                    },
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            return updatedAccount
            
        },
        deleteBankAccount:async(_,{id},{user:authUser})=>{
            if(!authUser) throw new Error("Authentication required");
            const deleted=await BankAccount.findByIdAndDelete(id)
            if(!deleted) throw new Error("Account not found for deletion");
            return true
            
        }
    }
}