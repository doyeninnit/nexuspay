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
// const cors = require('cors');
import cors from 'cors'
// const SALT_ROUNDS = 10;
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


const app = express();
const PORT = 8000;
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000' // only allow requests from this origin
}));

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
      // res.send({ message: "Logged in successfully!", walletAddress: user.walletAddress });
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
        res.send({ message: "Registered and logged in successfully!", walletAddress: walletAddress, pkt: pk });
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
  const { tokenAddress, recipientPhoneNumber, amount } = req.body;

  if (!tokenAddress || !recipientPhoneNumber || !amount) {
      return res.status(400).send({ message: "Required parameters are missing!" });
  }

  // Find user with the provided phone number
  const user = await User.findOne({ phoneNumber: recipientPhoneNumber });
  if (!user) {
      return res.status(404).send({ message: "Recipient phone number not found!" });
  }

  try {
      await sendToken(tokenAddress, user.walletAddress, amount);
      res.send({ message: 'Token sent successfully!' });
  } catch (error) {
      console.error("Error in API endpoint:", error);
      res.status(500).send({ message: 'Failed to send token.', error: error });
  }
});

app.post('/pay', async (req: Request, res: Response) => {
  const { tokenAddress, businessUniqueCode, amount, confirm } = req.body;

  if (!tokenAddress || !businessUniqueCode || !amount) {
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
      await sendToken(tokenAddress, business.walletAddress, amount);
      res.send({ message: 'Token sent successfully to the business!' });
  } catch (error) {
      console.error("Error in API endpoint:", error);
      res.status(500).send({ message: 'Failed to send token.', error: error });
  }
});





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



async function sendToken(tokenAddress: string, recipientAddress: string, amount: number) {
  try {
    const biconomySmartAccount = smartAccount
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



