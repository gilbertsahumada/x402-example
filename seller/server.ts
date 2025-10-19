import express from "express";
import { paymentMiddleware } from "x402-express";

const app = express();

const PORT = 4021;

app.use(
  paymentMiddleware("0xb322E239E5A32724633A595b8f8657F9cbb307B2", {
    "GET /mint": {
      // USDC AMOUNT IN DOLLARS
      price: "0.005",
      network: "base-sepolia",
    },
  },
  {
    url: "https://x402.org/facilitator"
  }
));

app.get("/mint", (req, res) => {
  res.json({
    message: "Mint successful! You have paid the required amount.",
    status: "success"
  });
});

app.listen(PORT, () => {
    console.log(`Seller server running on http://localhost:${PORT}`);
});
