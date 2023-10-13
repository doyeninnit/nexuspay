import { config } from "dotenv"
import { IBundler, Bundler } from '@biconomy/bundler'
import { ChainId } from "@biconomy/core-types"
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers } from 'ethers';
import { BiconomyPaymaster } from "@biconomy/paymaster";
const { ERC20ABI } = require('../abi')
import express from 'express';
import { connect } from './database';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { User } from './models';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
config()


const bundler: IBundler = new Bundler({
  bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai")
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);
// const wallet = new Wallet("", provider);


const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
  signer: wallet,
  chainId: ChainId.POLYGON_MUMBAI,
  bundler: bundler
}


async function createAccount() {
    // Generate a new EOA for the user
    const userEOA = generateEOA();
    
    const userWallet = new Wallet(userEOA.privateKey, provider);
  
    const biconomySmartAccountConfig = {
      signer: userWallet, 
      chainId: ChainId.POLYGON_MUMBAI,
      bundler: bundler
    }
  
    let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
    biconomySmartAccount = await biconomySmartAccount.init();
  
    console.log("EOA Address: ", userEOA.address);
    console.log("Smart Wallet Address: ", await biconomySmartAccount.getSmartAccountAddress());
  
    // return {
    //   eoaAddress: userEOA.address,
    //   smartWalletAddress: await biconomySmartAccount.getSmartAccountAddress()
    // };
      return biconomySmartAccount;

  }

async function createTransaction() {
  console.log("creating account")

  const smartAccount = await createAccount();

  const transaction = {
    to: '0xA82fb8eF1dcff52FD38a2ce08Fc8A142e1FAA12b',
    data: '0x',
    value: ethers.utils.parseEther('0.01'),
  }

  const userOp = await smartAccount.buildUserOp([transaction])
  userOp.paymasterAndData = "0x"

  const userOpResponse = await smartAccount.sendUserOp(userOp)

  const transactionDetail = await userOpResponse.wait()

  console.log("transaction detail below")
  console.log(transactionDetail)
}

async function createTokenTransfer(recipientAddress: string, amount: number, tokenAddress: string) {
  const readProvider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai");
  const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, readProvider);
  let decimals = 18;
  try {
    decimals = await tokenContract.decimals();
  } catch (error) {
    throw new Error('Invalid token address supplied');
  }
  const amountGwei = ethers.utils.parseUnits(amount.toString(), decimals);
  const data = (await tokenContract.populateTransaction.transfer(recipientAddress, amountGwei)).data;
  return {
    to: tokenAddress,
    data,
    value: 0 // No ether is sent in a standard ERC20 transfer
  };
}

async function createTransaction2(isTokenTransfer = false, tokenAddress = "", recipientAddress = "", amount: number) {
  console.log("creating account");

  const smartAccount = await createAccount();

  let transaction;
  if (isTokenTransfer) {
    transaction = await createTokenTransfer(recipientAddress, amount, tokenAddress);
  } else {
    transaction = {
      to: '0xA82fb8eF1dcff52FD38a2ce08Fc8A142e1FAA12b',
      data: '0x',
      value: ethers.utils.parseEther('0.01'),
    };
  }

  const userOp = await smartAccount.buildUserOp([transaction]);
  userOp.paymasterAndData = "0x"; // You might want to integrate paymaster here for ERC20 transactions

  const userOpResponse = await smartAccount.sendUserOp(userOp);
  const transactionDetail = await userOpResponse.wait();

  console.log("transaction detail below");
  console.log(transactionDetail);
}


const app = express();
const PORT = 8000;

app.use(express.json());

// Middlewares
app.use(bodyParser.json());


app.post('/register', async (req, res) => {
    const { phoneNumber, password } = req.body;
  
    if (!phoneNumber || !password) {
      return res.status(400).send({ message: "Phone number and password are required!" });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
    const smartAccount = await createAccount();
    const walletAddress = await smartAccount.getSmartAccountAddress();
  
    try {
      const user = new User({
        phoneNumber: phoneNumber,
        walletAddress: walletAddress,
        password: hashedPassword
      });
      await user.save();
  
      res.send({ message: "Registered successfully!", walletAddress: walletAddress });
    } catch (error) {
      console.error("Error registering user:", error);
      if (error === 11000) { 
          res.status(409).send({ message: "Phone number already registered!" });
      } else {
          res.status(500).send({ message: "An error occurred while registering." });
      }
    }
  });

  app.post('/login', async (req, res) => {
    const { phoneNumber, password } = req.body;
  
    if (!phoneNumber || !password) {
      return res.status(400).send({ message: "Phone number and password are required!" });
    }
  
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      return res.status(401).send({ message: "Invalid credentials!" });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid credentials!" });
    }
  
    res.send({ message: "Logged in successfully!", walletAddress: user.walletAddress });
  });
  

// app.post('/sendTokens', async (req, res) => {
//   const { phoneNumber, amount, tokenContractAddress } = req.body;
//   console.log(req.body)
//   try {
//     const user = await User.findOne({ phoneNumber: phoneNumber });
//     if (!user) {
//       return res.status(404).send("User not found.");
//     }
//     console.log(user.walletAddress)
//     await createTransaction2(true, tokenContractAddress, user.walletAddress, amount);
//     res.status(200).send("Tokens sent successfully!");
//   } catch (error) {
//     console.error("Error sending tokens:", error);
//     res.status(500).send("Error sending tokens.");
//   }
// });

app.post('/sendTokens', async (req, res) => {
    const { senderPhoneNumber, recipientPhoneNumber, amount, tokenContractAddress } = req.body;
    
    if (!senderPhoneNumber || !recipientPhoneNumber) {
      return res.status(400).send("Both sender and recipient phone numbers are required.");
    }
  
    try {
      // Fetch sender's wallet address
      const senderUser = await User.findOne({ phoneNumber: senderPhoneNumber });
      if (!senderUser) {
        return res.status(404).send("Sender not found.");
      }
  
      // Fetch recipient's wallet address
      const recipientUser = await User.findOne({ phoneNumber: recipientPhoneNumber });
      if (!recipientUser) {
        return res.status(404).send("Recipient not found.");
      }
  
      // Create token transfer transaction
      const transaction = await createTokenTransfer(recipientUser.walletAddress, amount, tokenContractAddress);
      console.log(`receiver is ${recipientUser.walletAddress}, sender is ${senderUser.walletAddress}`)
      // Build the transaction using Biconomy's Smart Account
      const smartAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
      await smartAccount.init();
      const userOp = await smartAccount.buildUserOp([transaction]);
      userOp.paymasterAndData = "0x"; // You might want to integrate paymaster here for ERC20 transactions
  
      // Send the meta-transaction via Biconomy
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      const transactionDetail = await userOpResponse.wait();
  
      res.status(200).send(`Tokens sent successfully!" ${transactionDetail.receipt}`); 
    } catch (error) {
      console.error("Error sending tokens:", error);
      res.status(500).send("Error sending tokens.");
    }
  });
  

// This function will generate a new EOA for the user
function generateEOA() {
    const newWallet = Wallet.createRandom();
    return {
      address: newWallet.address,
      privateKey: newWallet.privateKey
    };
  }

connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  console.log('Connected to MongoDB');
});
