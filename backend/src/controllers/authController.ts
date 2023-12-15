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
} from "@biconomy/paymaster";
// const { ERC20ABI } = require('../abi')
import { User } from '../models/models';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Place your existing config and bundler setup here
const bundler: IBundler = new Bundler({
  bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',     
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: "https://paymaster.biconomy.io/api/v1/80001/HaTCCk72C.3dec203b-4396-4337-b40a-8ac1ab0cb0ea",
});

const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai");

const SALT_ROUNDS = 10; // Consider storing this in environment variables

// Include any additional functions and interfaces used by the controller
// ...

export const authenticateUser = async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body;
   console.log("hit")
  if (!phoneNumber || !password) {
    return res.status(400).send({ message: "Phone number and password are required!" });
  }

  // The existing logic from your index.ts for the /auth route
  // ...
  
  let user = await User.findOne({ phoneNumber: phoneNumber });
  // If user exists, attempt login
  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials!" });
    }
    let privateKeyForUser = user.privateKey;

    let userAccount = await instanceAccount(privateKeyForUser)
    //  smartAccount = userAccount
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
    //   smartAccount = userSmartAccount
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
};

// Include any other functions from index.ts that are related to authentication
// ...


export async function createAccount() {
 
    const newWallet = Wallet.createRandom();
    const pk = newWallet.privateKey
    const wallet = new Wallet(pk, provider);
    // let smartAccount: BiconomySmartAccount;
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

    export async function instanceAccount(prikey: string) {
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