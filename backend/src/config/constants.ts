import { ethers, providers } from "ethers";
import { ERC20ABI } from "./abi";


export const provider = new providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai")
export const tokenAddress = '0xEE49EA567f79e280E4F1602eb8e6479d1Fb9c8C8'
export const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
