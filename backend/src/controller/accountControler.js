import bankAccount from "../../models/bankAccount.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";

// Validation schemas
const accountSchema = Joi.object({
  accountHolderName: Joi.string().min(3).required(),
  balance: Joi.number().min(0).default(0),
});

const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

const transferSchema = Joi.object({
  fromAccountId: Joi.string().required(),
  toAccountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

// -------------------- Controllers --------------------

// Create bank account (linked to logged-in user)
export const createBankAccount = async (req, res) => {
  try {
    const { error, value } = accountSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Check if user has any existing accounts
    const existingAccounts = await bankAccount.find({ userId: new mongoose.Types.ObjectId(req.user.userId) });
    
    // If user has existing accounts, check if any have transactions
    if (existingAccounts.length > 0) {
      const hasTransactions = existingAccounts.some(account => account.transactions && account.transactions.length > 0);
      
      if (!hasTransactions) {
        return res.status(403).json({ 
          message: "Cannot create new account. Please complete at least one transaction in your existing account(s) before creating a new one." 
        });
      }
    }

    const newAccount = new bankAccount({
      accountNumber: uuidv4(),
      ...value,
      userId: new mongoose.Types.ObjectId(req.user.userId), // link account to logged-in user
      transactions: [],
    });

    const savedAccount = await newAccount.save();
    res.status(201).json({ savedAccount });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ message: "Account number already exists. Please try again." });
    }
    res.status(500).json({ message: "Failed to create account", error: error.message });
  }
};

// Get accounts
export const getBankAccount = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const filter = isAdmin ? {} : { userId: req.user.userId };
    const accounts = await bankAccount.find(filter);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch accounts", error: error.message });
  }
};

// Get account by ID (admin can access any; users only their own)
export const getBankAccountById = async (req, res) => {
  try {
    const account = await bankAccount.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account not found" });

    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin && String(account.userId) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch account", error: error.message });
  }
};

// Update bank account (user can only update own account)
export const updateBankAccount = async (req, res) => {
  try {
    const account = await bankAccount.findById(req.params.id);
    if (!account || String(account.userId) !== String(req.user.userId))
      return res.status(404).json({ message: "Account not found" });

    Object.assign(account, req.body);
    await account.save();
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: "Failed to update account", error: error.message });
  }
};

// Delete bank account
export const deleteBankAccount = async (req, res) => {
  try {
    const account = await bankAccount.findById(req.params.id);
    if (!account || String(account.userId) !== String(req.user.userId))
      return res.status(404).json({ message: "Account not found" });

    await account.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account", error: error.message });
  }
};

// Deposit
export const deposit = async (req, res) => {
  try {
    const { error, value } = transactionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const account = await bankAccount.findById(req.params.id);
    if (!account || String(account.userId) !== String(req.user.userId))
      return res.status(404).json({ message: "Account not found" });

    account.balance += value.amount;
    account.transactions.push({
      txnId: uuidv4(),
      type: "deposit",
      amount: value.amount,
    });

    await account.save();
    res.json({ message: "Deposit successful", account });
  } catch (error) {
    res.status(500).json({ message: "Failed to deposit", error: error.message });
  }
};

// Withdraw
export const withdraw = async (req, res) => {
  try {
    const { error, value } = transactionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const account = await bankAccount.findById(req.params.id);
    if (!account || String(account.userId) !== String(req.user.userId))
      return res.status(404).json({ message: "Account not found" });

    if (account.balance < value.amount)
      return res.status(400).json({ message: "Insufficient balance" });

    account.balance -= value.amount;
    account.transactions.push({
      txnId: uuidv4(),
      type: "withdraw",
      amount: value.amount,
    });

    await account.save();
    res.json({ message: "Withdrawal successful", account });
  } catch (error) {
    res.status(500).json({ message: "Failed to withdraw", error: error.message });
  }
};

// Transfer
export const transfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error, value } = transferSchema.validate(req.body);
    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: error.details[0].message });
    }

    const { fromAccountId, toAccountId, amount } = value;
    if (fromAccountId === toAccountId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Cannot transfer to the same account." });
    }

    const fromAccount = await bankAccount.findById(fromAccountId).session(session);
    const toAccount = await bankAccount.findById(toAccountId).session(session);

    if (!fromAccount || !toAccount)
      return res.status(404).json({ message: "One or both accounts not found." });

    if (String(fromAccount.userId) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Forbidden: You do not own the source account." });
    }

    if (fromAccount.balance < amount)
      return res.status(400).json({ message: "Insufficient balance for transfer." });

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    fromAccount.transactions.push({
      txnId: uuidv4(),
      type: "transfer",
      amount: -amount,
      toAccount: toAccountId,
    });

    toAccount.transactions.push({
      txnId: uuidv4(),
      type: "transfer",
      amount: amount,
      fromAccount: fromAccountId,
    });

    await fromAccount.save({ session });
    await toAccount.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Transfer successful", fromAccount, toAccount });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Failed to process transfer", error: err.message });
  }
};
