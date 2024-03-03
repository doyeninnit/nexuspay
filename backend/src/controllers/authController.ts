import { config } from "dotenv"
import { ChainId } from "@biconomy/core-types"
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers } from 'ethers';
import { User } from '../models/models';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { bundler, paymaster, provider } from "../config/constants";

const SALT_ROUNDS = 10; 

export const loginUser = async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).send({ message: "Phone number and password are required!" });
  }

  let user = await User.findOne({ phoneNumber: phoneNumber });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({ message: "Invalid credentials!" });
  }

  const token = jwt.sign({ phoneNumber: user.phoneNumber, walletAddress: user.walletAddress }, 'zero', { expiresIn: '1h' });
  res.send({ token, message: "Logged in successfully!", walletAddress: user.walletAddress, phoneNumber: user.phoneNumber });
};


export const registerUser = async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).send({ message: "Phone number and password are required!" });
  }

  let existingUser = await User.findOne({ phoneNumber: phoneNumber });
  if (existingUser) {
    return res.status(409).send({ message: "Phone number already registered!" });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const userSmartAccount = await createAccount();
  const { biconomySmartAccount, pk } = userSmartAccount;
  const walletAddress = await biconomySmartAccount.getSmartAccountAddress();

  try {
    const newUser = new User({
      phoneNumber: phoneNumber,
      walletAddress: walletAddress,
      password: hashedPassword,
      privateKey: pk
    });
    await newUser.save();

    const token = jwt.sign({ phoneNumber: newUser.phoneNumber, walletAddress: newUser.walletAddress }, 'zero', { expiresIn: '1h' });
    res.send({ token, message: "Registered successfully!", walletAddress: newUser.walletAddress, phoneNumber: newUser.phoneNumber });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ message: "An error occurred while registering." });
  }
};

export async function createAccount() {
 
    const newWallet = Wallet.createRandom();
    const pk = newWallet.privateKey
    const wallet = new Wallet(pk, provider);
  
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
