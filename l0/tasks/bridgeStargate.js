const dotenv = require("dotenv");
dotenv.config();

const { task } = require("hardhat/config");

task("bridgin", "test bridge")
  .setAction(async (taskArgs, { ethers, network }) => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.FTM_MAINNET_URL);
    const deployerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log('test');
    return;
  });