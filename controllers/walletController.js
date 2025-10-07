import { Wallet, HDNodeWallet, Mnemonic } from "ethers";
const accountStorage = [];
export const createRandomAccounts = async (req, res) => {
  try {
    const { count = 1, includePrivate = true } = req.body || {};
    const n = Math.max(1, Math.min(1000, parseInt(count, 10) || 1));

    const results = [];

    for (let i = 0; i < n; i++) {
      const wallet = Wallet.createRandom();
      results.push({
        index: i,
        address: wallet.address,
        privateKey: includePrivate ? wallet.privateKey : undefined,
      });
    }

    return res.json({
      mode: "random",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const createHDAccounts = async (req, res) => {
  try {
    const {
      count = 1,
      path = "m/44'/60'/0'/0",
      startIndex = 0,
      includePrivate = true,
      balance = 0,
    } = req.body || {};

    const n = Math.max(1, Math.min(1000, parseInt(count, 10) || 1));
    const start = parseInt(startIndex, 10) || 0;
    const includePriv = Boolean(includePrivate);

    // random wallet (which includes a mnemonic)
    const randomWallet = HDNodeWallet.createRandom();
    const mnemonic = randomWallet.mnemonic.phrase;
    const mnemonicInstance = Mnemonic.fromPhrase(mnemonic);
    // Generate derived accounts
    const results = [];
    for (let i = 0; i < n; i++) {
      const index = start + i;
      const fullPath = `${path}/${index}`;

      const wallet = HDNodeWallet.fromMnemonic(mnemonicInstance, fullPath);
      const walletData = {
        index,
        derivationPath: fullPath,
        address: wallet.address,
        privateKey: includePriv ? wallet.privateKey : undefined,
        balance,
      };
      results.push(walletData);
      accountStorage.push(walletData);
    }
    return res.json({
      mode: "hd",
      mnemonic: includePriv ? mnemonic : undefined,
      path,
      startIndex: start,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("createHDWallets error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const addFundsToAccounts = async (req, res) => {
  try {
    const { amount = 0 } = req.body;

    if (accountStorage.length === 0) {
      return res.status(400).json({ error: "No wallets available to fund" });
    }

    const results = accountStorage.map((wallet) => {
      wallet.balance += Number(amount); // add funds
      return {
        address: wallet.address,
        balance: wallet.balance,
        added: Number(amount),
      };
    });

    return res.json({
      message: "Funds added successfully (simulated)",
      fundedCount: results.length,
      results,
    });
  } catch (error) {
    console.error("addFundsToWallet error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const transferFunds = async (req, res) => {
  try {
    const { fromAddress, toAddress, amount } = req.body;

    if (!fromAddress || !toAddress || !amount) {
      return res
        .status(400)
        .json({ error: "fromAddress, toAddress, and amount are required" });
    }

    if (fromAddress === toAddress) {
      return res
        .status(400)
        .json({ error: "Cannot transfer to the same wallet" });
    }

    // Find the account
    const fromWallet = accountStorage.find((w) => w.address === fromAddress);
    const toWallet = accountStorage.find((w) => w.address === toAddress);

    if (!fromWallet || !toWallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    const transferAmount = Number(amount);

    if (fromWallet.balance < transferAmount) {
      return res
        .status(400)
        .json({ error: "Insufficient balance in sender wallet" });
    }

    // Transfer balance
    fromWallet.balance -= transferAmount;
    toWallet.balance += transferAmount;

    return res.json({
      message: "Transfer successful",
      from: { address: fromWallet.address, balance: fromWallet.balance },
      to: { address: toWallet.address, balance: toWallet.balance },
      transferred: transferAmount,
    });
  } catch (error) {
    console.error("transferFunds error:", error);
    res.status(500).json({ error: error.message });
  }
};
