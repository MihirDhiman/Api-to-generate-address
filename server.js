import express from "express";
import cors from "cors";
import helmet from "helmet";
import walletRoutes from "./routes/walletRoutes.js";

const app = express();

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/wallets', walletRoutes);

app.get('/', (req, res) => res.send('Wallet generator API running'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
