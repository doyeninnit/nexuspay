import { config } from "dotenv"
import { IBundler, Bundler } from '@biconomy/bundler'
import { ChainId } from "@biconomy/core-types"
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers } from 'ethers';
import { BiconomyPaymaster } from "@biconomy/paymaster";
const { ERC20ABI } = require('../abi')

config()


const bundler: IBundler = new Bundler({
    bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',     
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })

  const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai")
const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);

const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
    signer: wallet,
    chainId: ChainId.POLYGON_MUMBAI,
    bundler: bundler
  }

  async function createAccount() {
    let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig)
    biconomySmartAccount =  await biconomySmartAccount.init()
    console.log("owner: ", biconomySmartAccount.owner)
    console.log("address: ", await biconomySmartAccount.getSmartAccountAddress())
    return biconomySmartAccount;
  }
//   address:  0xc41d51ce2471520bf59fe97e03ca882daedf3e09
  


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

  async function createTokenTransfer( recipientAddress: string, amount: number, tokenAddress: string) {
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

  createTransaction2(true, "0xdA5289fCAAF71d52a80A254da614a192b693e977", "0xA82fb8eF1dcff52FD38a2ce08Fc8A142e1FAA12b", 2)




