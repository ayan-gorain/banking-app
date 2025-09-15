import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  txnId: { type: String, required: true },  // No unique index here
  type: { type: String, enum: ["deposit", "withdraw", "transfer"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  toAccount: { type: String },    
  fromAccount: { type: String }, 
});

const bankAccountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  accountHolderName: { type: String, required: true },
  balance: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactions: [transactionSchema],
  createdAt: { type: Date, default: Date.now },
});

// Remove any explicit index on transactions.txnId

export default mongoose.model("BankAccount", bankAccountSchema);
