import express from "express";
import {
  createRandomWallets,
  createHDWallets,
  addFundsToAccounts,
} from "../controllers/walletController.js";

const router = express.Router();

// POST /api/wallets/create
router.post("/create", createRandomWallets);
router.post("/create-hd", createHDWallets);
router.post("/add-funds", addFundsToAccounts);

export default router;
