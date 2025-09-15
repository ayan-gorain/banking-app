import loan from "../../models/loan.js";
import bankAccount from "../../models/bankAccount.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";

const loanSchema = Joi.object({
  accountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  interestRate: Joi.number().positive().required(),
  termMonths: Joi.number().positive().required(),
});

const repayScheme = Joi.object({
  amount: Joi.number().positive().required(),
});

export const createLoan = async (req, res) => {
  try {
    const { error, value } = loanSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { accountId, amount, interestRate, termMonths } = value;

    const account = await bankAccount.findById(accountId);
    if (!account || String(account.userId) !== String(req.user.userId))
      return res.status(403).json({ message: "Invalid bank account" });

   const newLoan = new loan({
      loanNumber: uuidv4(),
      userId: new mongoose.Types.ObjectId(req.user.userId),    
      accountId: new mongoose.Types.ObjectId(accountId),
      amount,                    
      interestRate,
      termMonths,
      balanceRemaining: amount,
      approved: false,
      repayments: [],
      createdAt: new Date(),
    });

    const savedLoan = await newLoan.save();

    res.status(201).json({ savedLoan });
  } catch (error) {
    res.status(500).json({ message: "Failed to create loan", error: error.message });
  }
};

export const getLoans = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const query = isAdmin ? {} : { userId: req.user.userId };
    const loans = await loan.find(query).populate("accountId");
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch loans", error: error.message });
  }
};

export const getLoansById = async (req, res) => {
  try {
    const foundLoan = await loan.findById(req.params.id);
    if (!foundLoan || String(foundLoan.userId) !== String(req.user.userId))
      return res.status(404).json({ message: "Loan not found" });

    res.json(foundLoan);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch loan", error: error.message });
  }
};

export const repayLoan = async (req, res) => {
  try {
    const { error, value } = repayScheme.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const foundLoan = await loan.findById(req.params.id);
    if (!foundLoan) return res.status(404).json({ message: "Loan not found" });

    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin && String(foundLoan.userId) !== String(req.user.userId)) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (!foundLoan.approved) {
      return res.status(400).json({ message: "Loan not approved yet" });
    }

    if (value.amount > foundLoan.balanceRemaining)
      return res.status(400).json({ message: "Repayment exceeds balance remaining" });

    foundLoan.balanceRemaining -= value.amount;

    foundLoan.repayments.push({
      repaymentId: uuidv4(),
      amount: value.amount,
      date: new Date(),
    });

    await foundLoan.save();

    if (foundLoan.balanceRemaining === 0) {
      const closedLoanId = foundLoan._id;
      await foundLoan.deleteOne();
      return res.json({ message: "Loan fully repaid and closed", closed: true, loanId: closedLoanId });
    }

    res.json({ message: "Repayment successful", loan: foundLoan });
  } catch (error) {
    res.status(500).json({ message: "Failed to repay loan", error: error.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const foundLoan = await loan.findById(req.params.id);

    if (!foundLoan || String(foundLoan.userId) !== String(req.user.userId))
      return res.status(404).json({ message: "Loan not found" });

    await foundLoan.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete loan", error: error.message });
  }
};

export const approveLoan = async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can approve loans' });
    }

    const foundLoan = await loan.findById(req.params.id);
    if (!foundLoan) return res.status(404).json({ message: 'Loan not found' });

    if (foundLoan.approved) {
      return res.json({ message: 'Loan already approved', loan: foundLoan });
    }

    foundLoan.approved = true;
    foundLoan.approvedAt = new Date();
    foundLoan.approvedBy = new mongoose.Types.ObjectId(req.user.userId);
    await foundLoan.save();
    res.json({ message: 'Loan approved', loan: foundLoan });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve loan', error: error.message });
  }
};
