import express from "express";
import {
  createRandomWallets,
  createHDWallets,
} from "../controllers/walletController.js";

const router = express.Router();

// POST /api/wallets/create
router.post("/create", createRandomWallets);
router.post("/create-hd", createHDWallets);

export default router;
