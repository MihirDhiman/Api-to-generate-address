import { Wallet, JsonRpcProvider, parseEther } from "ethers";

export const createRandomWallets = async (req, res) => {
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

export const createHDWallets = async (req, res) => {
  try {
    const {
      count = 1,
      path = "m/44'/60'/0'/0",
      startIndex = 0,
      includePrivate = true,
    } = req.body || {};

    const n = Math.max(1, Math.min(1000, parseInt(count, 10) || 1));
    const start = parseInt(startIndex, 10) || 0;
    const includePriv = Boolean(includePrivate);

    // random wallet (which includes a mnemonic)
    const randomWallet = Wallet.createRandom();
    const mnemonic = randomWallet.mnemonic.phrase;

    // Generate derived accounts
    const results = [];
    for (let i = 0; i < n; i++) {
      const index = start + i;
      const fullPath = `${path}/${index}`;
      const wallet = Wallet.fromPhrase(mnemonic, fullPath);
      results.push({
        index,
        derivationPath: fullPath,
        address: wallet.address,
        privateKey: includePriv ? wallet.privateKey : undefined,
      });
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

export const addFundsToWallet = async (req, res) => {
  try {
    const { wallets = [], amount = 0 } = req.body;

    if (!Array.isArray(wallets) || wallets.length === 0) {
      return res.status(400).json({ error: "No wallets provided" });
    }

    const results = wallets.map((wallet) => {
      wallet.balance = (wallet.balance || 0) + Number(amount); // add funds
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
