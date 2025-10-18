import express from "express";
import { paymentMiddleware } from "x402-express";

const app = express();

app.use(
  paymentMiddleware("0xYourSellerAddressHere", {
    "GET: /mint": {
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
  res.send("Mint successful! You have paid the required amount.");
});

app.listen(4021, () => {
    console.log("Seller server running on http://localhost:4021");
});
