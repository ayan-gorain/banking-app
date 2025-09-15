import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createBankAccount,
  getBankAccount,
  getBankAccountById,
  updateBankAccount,
  deleteBankAccount,
  deposit,
  withdraw,
  transfer,
} from "../controller/accountControler.js";
import { createLoan, deleteLoan, getLoans, getLoansById, repayLoan, approveLoan } from "../controller/loanController.js";

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Bank account routes
router.post("/", authMiddleware,createBankAccount);
router.get("/",authMiddleware, getBankAccount);

// Loan routes (must come before /:id routes)
router.post("/loan",authMiddleware, createLoan);
router.get("/loan",authMiddleware, getLoans);
router.get("/loan/:id",authMiddleware, getLoansById);
router.post("/loan/:id/repay",authMiddleware, repayLoan);
router.delete("/loan/:id",authMiddleware, deleteLoan);
router.post("/loan/:id/approve",authMiddleware, approveLoan);

// Bank account specific routes (must come after loan routes)
router.get("/:id",authMiddleware, getBankAccountById);
router.put("/:id", authMiddleware,updateBankAccount);
router.delete("/:id",authMiddleware, deleteBankAccount);
router.post("/:id/deposit",authMiddleware, deposit);
router.post("/:id/withdraw", authMiddleware,withdraw);
router.post("/transfer",authMiddleware, transfer);

export default router;
