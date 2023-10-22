import { IBundler, Bundler } from '@biconomy/bundler'
import { ChainId } from "@biconomy/core-types"
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers } from 'ethers';

//initial configuration
const bundler: IBundler = new Bundler({
    bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',     
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })

  const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai")

  async function createAccount() {
  //this has to be dynamic for every new user so we will generate new wallet addresses instead of hardcoded
//   const wallet = new Wallet(process.env.PRIVATE_KEY || "", provider);

  const newWallet = Wallet.createRandom();
  const wallet = new Wallet(newWallet.privateKey, provider);

  //smart account config
  const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
    signer: wallet,
    chainId: ChainId.POLYGON_MUMBAI,
    bundler: bundler,
    // paymaster: paymaster
  }

  let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig)
  biconomySmartAccount =  await biconomySmartAccount.init()
  console.log("owner: ", biconomySmartAccount.owner)
  console.log("address: ", await biconomySmartAccount.getSmartAccountAddress())
  return biconomySmartAccount;
  }

  createAccount()