import { Request, Response } from 'express';
import { ethers, providers } from 'ethers';
import { provider, tokenAddress } from '../config/constants';


const usdcAbi = [ 
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": true,
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "type": "function"
    }
];


export const getUsdcBalance = async (req: Request, res: Response) => {
 
  try {
    const address = req.params.address;
    const usdcContract = new ethers.Contract(tokenAddress, usdcAbi, provider);

    const balanceRaw = await usdcContract.balanceOf(address);
    const decimals = await usdcContract.decimals();
    const balanceInUSDC = balanceRaw.div(ethers.BigNumber.from(10).pow(decimals)).toNumber();

    const conversionRate = await fetchUSDCToKESPrice();
    const balanceInKES = balanceInUSDC * conversionRate;
   console.log(balanceInKES)
    res.json({
        balanceInUSDC: balanceInUSDC,
        balanceInKES: balanceInKES.toFixed(2),
        rate: conversionRate
    });

} catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch balance.');
}
};

// Include any other USD Coin related functions here
async function fetchUSDCToKESPrice() {
    // Define the API endpoint
    const apiEndpoint = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=USDC&convert=KES';
  
    // Set the API key header
    const headers = {
      'X-CMC_PRO_API_KEY': '7e75c059-0ffc-41ca-ae72-88df27e0f202'
    };
  
    // Make a GET request to the API endpoint
    const response = await fetch(apiEndpoint, { headers });
  
    // Check the response status code
    if (response.status !== 200) {
      throw new Error(`Failed to fetch USDC to KES price: ${response.status}`);
    }
  
    // Parse the JSON response
    const data = await response.json();
  
    // Return the USDC to KES price
    return data.data['USDC'].quote['KES'].price;
  }