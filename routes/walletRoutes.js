import express from "express";
import {
  createRandomAccounts,
  createHDAccounts,
  addFundsToAccounts,
  transferFunds,
} from "../controllers/walletController.js";

const router = express.Router();

// POST /api/wallets/
router.post("/create", createRandomAccounts);
router.post("/create-hd", createHDAccounts);
router.post("/add-funds", addFundsToAccounts);
router.post("/transfer", transferFunds);

export default router;
