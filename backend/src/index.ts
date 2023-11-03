import { config } from "dotenv"
import { IBundler, Bundler } from '@biconomy/bundler'
import { ChainId } from "@biconomy/core-types"
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers } from 'ethers';
import {
  IPaymaster,
  BiconomyPaymaster,
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from "@biconomy/paymaster";const { ERC20ABI } = require('../abi')
import express from 'express';
import { connect } from './database';
import bodyParser from 'body-parser';
import { User } from './models';
import { Business } from './businessModel'
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors'
import fetch from "node-fetch";
import { PushAPI } from '@pushprotocol/restapi'
import Binance from 'binance-api-node'


config()



//initial configuration
const bundler: IBundler = new Bundler({
  bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',     
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})
const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
      "https://paymaster.biconomy.io/api/v1/80001/HaTCCk72C.3dec203b-4396-4337-b40a-8ac1ab0cb0ea",
});
const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai")

interface CacheData {
  // balanceInUSDC: any; 
  // balanceInKES: string;
  rate: any; 
}

// In-memory cache
const cache: {
  lastFetch: number;
  data: CacheData | null; // Initially, there's no data, so it's null, but it can later hold a CacheData object
} = {
  lastFetch: 0,
  data: null
};



const app = express();
const PORT = 8000;
app.use(cors({
  origin: '*' // Allow any origin
}));
app.options('*', cors()); // This will enable preflight requests for all routes

app.use(express.json());

// Middlewares
app.use(bodyParser.json());


const SALT_ROUNDS = 10; // Consider storing this in environment variables

let smartAccount: any;

app.post('/auth', async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body;
  
    if (!phoneNumber || !password) {
      return res.status(400).send({ message: "Phone number and password are required!" });
    }
  
    let user = await User.findOne({ phoneNumber: phoneNumber });
    // If user exists, attempt login
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Invalid credentials!" });
      }
      let privateKeyForUser = user.privateKey;

      let userAccount = await instanceAccount(privateKeyForUser)
       smartAccount = userAccount
       const token = jwt.sign({ phoneNumber: user.phoneNumber, walletAddress: user.walletAddress }, 'zero', { expiresIn: '1h' });
       res.send({ token, message: "Logged in successfully!", walletAddress: user.walletAddress, phoneNumber: user.phoneNumber });
    } 
    // If user doesn't exist, attempt registration
    else {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const userSmartAccount = await createAccount();
      const {biconomySmartAccount, pk} = userSmartAccount
      const walletAddress = await biconomySmartAccount.getSmartAccountAddress();

      try {
        user = new User({
          phoneNumber: phoneNumber,
          walletAddress: walletAddress,
          password: hashedPassword,
          privateKey: pk
        });
        await user.save();
        smartAccount = userSmartAccount
        const token = jwt.sign({ phoneNumber: user.phoneNumber, walletAddress: user.walletAddress }, 'zero', { expiresIn: '1h' });
        res.send({ token, message: "Registered successfully!", walletAddress: user.walletAddress, phoneNumber: user.phoneNumber });
      } catch (error) {
        console.error("Error registering user:", error);
        if (error === 11000) { // Handling unique constraint violation
            res.status(409).send({ message: "Phone number already registered!" });
        } else {
            res.status(500).send({ message: "An error occurred while registering." });
        }
      }
    }
});


app.post('/registerBusiness', async (req: Request, res: Response) => {
  const { businessName, ownerName, location, phoneNumber, password } = req.body;

  if (!businessName || !ownerName || !location || !phoneNumber || !password) {
    return res.status(400).send({ message: "All fields are required!" });
  }

  // let business = await Business.findOne({ phoneNumber: phoneNumber });
  let business;

  // if (business) {
  //   return res.status(409).send({ message: "Business with this phone number is already registered!" });
  // }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const businessSmartAccount = await createAccount();
  const { biconomySmartAccount, pk } = businessSmartAccount;
  const walletAddress = await biconomySmartAccount.getSmartAccountAddress();

  // Generate unique 5-digit code
  const uniqueCode = (Math.floor(Math.random() * 90000) + 10000).toString();

  try {
    business = new Business({
      businessName,
      ownerName,
      location,
      uniqueCode,
      phoneNumber,
      walletAddress,
      password: hashedPassword,
      privateKey: pk
    });

    await business.save();
    res.send({ 
      message: "Business registered successfully!", 
      walletAddress: walletAddress, 
      uniqueCode: uniqueCode
    });

  } catch (error) {
    console.error("Error registering business:", error);
    res.status(500).send({ message: "An error occurred while registering the business." });
  }
});


app.post('/sendToken', async (req, res) => {
  const { tokenAddress, recipientPhoneNumber, amount, senderAddress } = req.body;

  if (!tokenAddress || !recipientPhoneNumber || !amount || !senderAddress) {
      return res.status(400).send({ message: "Required parameters are missing!" });
  }

  // Find user with the provided phone number
  const user = await User.findOne({ phoneNumber: recipientPhoneNumber });
  if (!user) {
      return res.status(404).send({ message: "Recipient phone number not found!" });
  }

  try {
      await sendToken(tokenAddress, user.walletAddress, amount, senderAddress);
      res.send({ message: 'Token sent successfully!' });
  } catch (error) {
      console.error("Error in API endpoint:", error);
      res.status(500).send({ message: 'Failed to send token.', error: error });
  }
});

app.post('/pay', async (req: Request, res: Response) => {
  const { tokenAddress, senderAddress, businessUniqueCode, amount, confirm } = req.body;

  if (!tokenAddress || !businessUniqueCode || !amount || !senderAddress) {
      return res.status(400).send({ message: "Token address, business unique code, and amount are required!" });
  }

  // Find a business with the provided unique code
  const business = await Business.findOne({ uniqueCode: businessUniqueCode });
  if (!business) {
      return res.status(404).send({ message: "Business with the provided unique code not found!" });
  }
//55760
  // If the user has not confirmed the transaction
  if (!confirm) {
    return res.status(200).send({
        message: "Please confirm the payment to the business.",
        businessName: business.businessName
    });
  }

  try {
      await sendToken(tokenAddress, business.walletAddress, amount, senderAddress);
      res.send({ message: 'Token sent successfully to the business!' });
  } catch (error) {
      console.error("Error in API endpoint:", error);
      res.status(500).send({ message: 'Failed to send token.', error: error });
  }
});


app.get('/token-transfer-events', async (req, res) => {
  const { address } = req.query;

  const apikey = '6IEU61WYVQZJ9WT2U2UYZ3TVT2V7YG7QDF'

  if (!address) {
      return res.status(400).send('Address required query parameters.');
  }

  try {
      const events = await getAllTokenTransferEvents( address as string, apikey);
      res.json(events);
  } catch (error) {
      console.error('Error fetching token transfer events:', error);
      res.status(500).send('Internal server error.');
  }
});


const USDC_ADDRESS = '0xEE49EA567f79e280E4F1602eb8e6479d1Fb9c8C8'; 

const usdcAbi = [ // Simplified ABI for the purposes of this example
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

app.get('/usdc-balance/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcAbi, provider);

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
});

// app.get('/usdc-balance/:address', async (req, res) => {
  // const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
  // const now = Date.now();
  
  // // If the data is cached and it was fetched less than 10 minutes ago, return the cached data
  // if (cache.data && (now - cache.lastFetch < tenMinutes)) {
  //   const conversionRate = cache.data.rate
  //   // return res.json(cache.data);
  // }

  // If the data is not in cache or it's stale (10 minutes have passed), fetch new data
//   try {
//     const address = req.params.address;
//     const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcAbi, provider);

//     const balanceRaw = await usdcContract.balanceOf(address);
//     const decimals = await usdcContract.decimals();
//     const balanceInUSDC = balanceRaw.div(ethers.BigNumber.from(10).pow(decimals)).toNumber();

//     const conversionRate = await fetchUSDCToKESPrice();
//     const balanceInKES = balanceInUSDC * conversionRate;
//     console.log(balanceInKES);

//     // Update cache
//     cache.lastFetch = now;
//     cache.data = {
//       balanceInUSDC: balanceInUSDC,
//       balanceInKES: balanceInKES.toFixed(2),
//       rate: conversionRate
//     };

//     res.json(cache.data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Failed to fetch balance.');
//   }
// });



connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  console.log('Connected to MongoDB');
});


    ///////CONTROLLERS///////




  async function createAccount() {
 
  const newWallet = Wallet.createRandom();
  const pk = newWallet.privateKey
  const wallet = new Wallet(pk, provider);
  let smartAccount: BiconomySmartAccount;
  //smart account config
  const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
    signer: wallet,
    chainId: ChainId.POLYGON_MUMBAI,
    bundler: bundler,
    paymaster: paymaster
  }

  let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig)
  biconomySmartAccount =  await biconomySmartAccount.init()
  
  console.log("owner: ", biconomySmartAccount.owner)
  console.log("address: ", await biconomySmartAccount.getSmartAccountAddress())
  return {biconomySmartAccount, pk};
  }

//368785456798
//2456789456
  async function instanceAccount(prikey: string) {
    const wallet = new Wallet(prikey, provider);

    //smart account config
    const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
      signer: wallet,
      chainId: ChainId.POLYGON_MUMBAI,
      bundler: bundler,
      paymaster: paymaster
    }
  
    let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig)
    biconomySmartAccount =  await biconomySmartAccount.init()
    console.log("owner: ", biconomySmartAccount.owner)
    console.log("address: ", await biconomySmartAccount.getSmartAccountAddress())
    return biconomySmartAccount;
  }



async function sendToken(tokenAddress: string, recipientAddress: string, amount: number, senderAddress: string) {
  try {
    let user = await User.findOne({ walletAddress: senderAddress });
    
    const biconomySmartAccount = await instanceAccount(user?.privateKey as string)
    // const biconomySmartAccount = smartAccount



    const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
    
    let decimals = 18;
    try {
      decimals = await tokenContract.decimals();
    } catch (error) {
      throw new Error('invalid token address supplied');
    }

    const amountGwei = ethers.utils.parseUnits(amount.toString(), decimals);
    const data = (await tokenContract.populateTransaction.transfer(recipientAddress, amountGwei)).data;
    const transaction = {
      to: tokenAddress,
      data,
    };

    // Build partial userOp
    let partialUserOp = await biconomySmartAccount.buildUserOp([transaction]);

    const biconomyPaymaster =
    biconomySmartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

let paymasterServiceData: SponsorUserOperationDto = {
    mode: PaymasterMode.SPONSORED,
};
console.log("getting paymaster and data");
try {
    const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
            partialUserOp,
            paymasterServiceData
        );
    partialUserOp.paymasterAndData =
        paymasterAndDataResponse.paymasterAndData;
} catch (e) {
    console.log("error received ", e);
}
console.log("sending userop");
try {
    const userOpResponse = await biconomySmartAccount.sendUserOp(partialUserOp);
    const transactionDetails = await userOpResponse.wait();
    console.log(
        `transactionDetails: https://mumbai.polygonscan.com/tx/${transactionDetails.receipt.transactionHash}`
    );
 
} catch (e) {
    console.log("error received ", e);
}
  } catch (error) {
    console.error("Error in sendToken:", error);
  }
}

// sendToken("0xEE49EA567f79e280E4F1602eb8e6479d1Fb9c8C8", "0xd5Bdd07DADF85F908660C543D7d43A37f2Ab1EF7", 10)
//   .catch(error => console.error("Error calling sendToken:", error));

// Global error handler for unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
// });


interface TokenTransferEvent {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    value: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    input: string;
    confirmations: string;
}

async function getAllTokenTransferEvents(
    walletAddress: string,
    apiKey: string,
    page: number = 1,
    offset: number = 5,
    sort: 'asc' | 'desc' = 'asc'
): Promise<TokenTransferEvent[]> {
    const baseURL = 'https://api-testnet.polygonscan.com/api';
    const url = `${baseURL}?module=account&action=tokentx&address=${walletAddress}&page=${page}&offset=${offset}&sort=${sort}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Failed to fetch data from PolygonScan');
      }
      
      const data = await response.json() as { status: string; message: string; result: TokenTransferEvent[] };
      if (data.status !== '1') {
          throw new Error(data.message);
      }
      
      return data.result;
      
    } catch (error) {
        console.error('Error fetching token transfer events:', error);
        return [];
    }
}


async function getConversionRate() {
  try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=kes`);
      const data = await response.json();
      console.log(`in kes: ${data.usd.kes}`)
      return data.usd.kes;
  } catch (error) {
      console.error("Failed to fetch conversion rate from CoinGecko:", error);
      throw error;
  }
}

async function getUSDCToKESRate() {
  try {
    // 1. Get USDC to USD rate
    const responseUSDC = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd');
    const dataUSDC = await responseUSDC.json();
    console.log(dataUSDC)
    const usdcToUsdRate = dataUSDC['usd-coin'].usd;

    // 2. Get USD to KES rate
    const responseUSD = await fetch('https://api.coingecko.com/api/v3/exchange_rates');
    console.log(responseUSD)
    const dataUSD = await responseUSD.json();
    const usdToKesRate = dataUSD.rates.kes.value;

    // 3. Calculate USDC to KES rate
    const usdcToKesRate = usdcToUsdRate * usdToKesRate;
 console.log(usdToKesRate)
    return usdcToKesRate;

  } catch (error) {
    console.error('Failed to fetch rates:', error);
    return null;
  }
}





// getUSDCToKESRate().then(rate => {
//   if (rate) {
//     console.log(`1 USDC is approximately ${rate.toFixed(2)} KES`);
//   } else {
//     console.log('Failed to get the conversion rate.');
//   }
// });

// Example usage:
// const walletAddress = '0xe1F4615Afec6801493FB889eDe3A70812c842d05';
// const apiKey = '6IEU61WYVQZJ9WT2U2UYZ3TVT2V7YG7QDF';

// getAllTokenTransferEvents(walletAddress, apiKey).then(events => {
//   console.log("start")
//     console.log(events);
// });


async function main(){
  // console.log(await client.prices({symbol: 'KESUSDC'}))
  const price = await fetchUSDCToKESPrice();

console.log(price)  
}
//  main()

async function fetchUSDCToKESPrice() {
  // Define the API endpoint
  const apiEndpoint = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=USDC&convert=KES';

  // Set the API key header
  const headers = {
    'X-CMC_PRO_API_KEY': '4d1123b4-e75c-41de-b016-0f27f577433b'
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

// main()