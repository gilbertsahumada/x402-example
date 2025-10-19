import { wrap } from 'module'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { wrapFetchWithPayment, decodeXPaymentResponse } from 'x402-fetch'

const URL_SELLER = 'http://localhost:4023/mint'
const account = privateKeyToAccount('0xYOUR_PRIVATE_KEY_HERE')

const fetchWithPayment = wrapFetchWithPayment(fetch, account);

fetchWithPayment(URL_SELLER, {
    method: 'GET',
}).then(async (response) => {
    const body = await response.json();
    console.log('Response from seller:', body);

    const paymentResponse = decodeXPaymentResponse(response.headers.get('x-payment-response')!);
    console.log('Payment Response:', paymentResponse);
}).catch((error) => {
    console.error('Error making request to seller:', error);
});
