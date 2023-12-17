import { Request, Response } from 'express';
import { User } from '../models/models';
import { Business } from '../models/businessModel';
import { IHybridPaymaster, PaymasterMode, SponsorUserOperationDto } from '@biconomy/paymaster';
import { ethers } from 'ethers';
import { instanceAccount } from './authController';
import fetch from "node-fetch";
import {tokenContract } from '../config/constants';


export const send = async (req: Request, res: Response) => {

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
};

export const pay = async (req: Request, res: Response) => {
 
  const { tokenAddress, senderAddress, businessUniqueCode, amount, confirm } = req.body;

  if (!tokenAddress || !businessUniqueCode || !amount || !senderAddress) {
      return res.status(400).send({ message: "Token address, business unique code, and amount are required!" });
  }

  // Find a business with the provided unique code
  const business = await Business.findOne({ uniqueCode: businessUniqueCode });
  if (!business) {
      return res.status(404).send({ message: "Business with the provided unique code not found!" });
  }

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
};

export const tokenTransferEvents = async (req: Request, res: Response) => {
 
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
};

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




async function sendToken1(tokenAddress: string, recipientAddress: string, amount: number, senderAddress: string) {
    try {
      let user = await User.findOne({ walletAddress: senderAddress });
      console.log("Private Key:", user);

      const biconomySmartAccount = await instanceAccount(user?.privateKey as string)
      // const biconomySmartAccount = smartAccount
  
  
  ///Store this token contract as a global variable, doesn't have to be initialized everytime
    //   const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
      
      let decimals = 18;
      try {
        decimals = await tokenContract.decimals();
      } catch (error) {
        throw new Error('invalid token address supplied');
      }

      const fee = 1
      const myAddress = "0x4c2C4bB506D2eFab0a7235DEee07E75737d5472f"
  
      const amountGwei = ethers.utils.parseUnits(amount.toString(), decimals);
      const amountGwei2 = ethers.utils.parseUnits(fee.toString(), decimals);

      const data = (await tokenContract.populateTransaction.transfer(recipientAddress, amountGwei)).data;
      const data2 = (await tokenContract.populateTransaction.transfer(myAddress, amountGwei2)).data;

      const transaction = {
        to: tokenAddress,
        data,
      };
  
      const transaction2 = {
        to: tokenAddress,
        data2
      }
      // Build partial userOp
      let partialUserOp = await biconomySmartAccount.buildUserOp([transaction, transaction2]);
  
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

  const PLATFORM_WALLET_ADDRESS = "0x4c2C4bB506D2eFab0a7235DEee07E75737d5472f"; // Hardcoded platform wallet address
  const FEE_PERCENTAGE = 0.005; // 0.5%
  
  async function sendToken(tokenAddress: string, recipientAddress: string, amount: number, senderAddress: string) {
      try {
          let user = await User.findOne({ walletAddress: senderAddress });
          console.log("Private Key:", user);
  
          const biconomySmartAccount = await instanceAccount(user?.privateKey as string);
  
          let decimals = 18;
          try {
              decimals = await tokenContract.decimals();
          } catch (error) {
              throw new Error('invalid token address supplied');
          }
  
          const amountGwei = ethers.utils.parseUnits(amount.toString(), decimals);
          const feeAmountGwei = ethers.utils.parseUnits((amount * FEE_PERCENTAGE).toString(), decimals);
  
          // Transaction to recipient
          const recipientData = (await tokenContract.populateTransaction.transfer(recipientAddress, amountGwei)).data;
          const recipientTransaction = {
              to: tokenAddress,
              data: recipientData,
          };
  
          // Transaction for platform fee
          const feeData = (await tokenContract.populateTransaction.transfer(PLATFORM_WALLET_ADDRESS, feeAmountGwei)).data;
          const feeTransaction = {
              to: tokenAddress,
              data: feeData,
          };
  
          // Batch the transactions
          let partialUserOp = await biconomySmartAccount.buildUserOp([recipientTransaction, feeTransaction]);
  
          // The remaining part of the code is similar
          // Handle paymaster, send userOp, etc.
  
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