import {
  wrapFetchWithPayment,
  decodeXPaymentResponse,
  createSigner,
} from "x402-fetch";
import { config } from "dotenv";

config();

const PRIVATE_KEY = process.env.PRIVATE_KEY!;

const URL_SELLER = "http://localhost:4021/mint";

async function main() {
  const signer = await createSigner("base-sepolia", PRIVATE_KEY);

  const fetchWithPayment = wrapFetchWithPayment(fetch, signer);

  fetchWithPayment(URL_SELLER, {
    method: "GET",
  })
    .then(async (response) => {
      const body = await response.json();
      console.log("Response from seller:", body);

      const paymentResponse = decodeXPaymentResponse(
        response.headers.get("x-payment-response")!
      );
      console.log("Payment Response:", paymentResponse);
    })
    .catch((error) => {
      console.error("Error making request to seller:", error);
    });
}

main().catch((error) => {
  console.error("Error in main function:", error);
});
