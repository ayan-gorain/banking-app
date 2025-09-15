// import express from "express";
// import { authMiddleware } from "../middleware/auth.js";
// import {
//   createBankAccount,
//   getBankAccount,
// } from "../controller/accountControler.js";
// import { createLoan, deleteLoan, getLoans, getLoansById, repayLoan } from "../controller/loanController.js";

// const router = express.Router();


// router.use(authMiddleware);


// router.post("/", authMiddleware,createBankAccount);
// router.get("/",authMiddleware, getBankAccount);


// router.post("/loan",authMiddleware, createLoan);
// router.get("/loan",authMiddleware, getLoans);
// router.get("/loan/:id",authMiddleware, getLoansById);
// router.post("/loan/:id/repay",authMiddleware, repayLoan);
// router.delete("/loan/:id",authMiddleware, deleteLoan);


// export default router;
