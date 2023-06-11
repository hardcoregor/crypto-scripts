const dotenv = require("dotenv");
const { execSync } = require('child_process');

const ERC20TOKEN = require("../contracts/ABI/ERC20TOKEN.json");
const stargatePolyABI = require("../contracts/ABI/Poly/StargateRouter.json");
const polyEndpointABI = require("../contracts/ABI/Poly/EndpointPoly.json");

const { checkBalance } = require('../scripts/utils');

const usdtPolyAddr = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
dotenv.config();

let balanceBefore;

const { task } = require("hardhat/config");

const stargatePoly = "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd";
const stargateBsc = "0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8";
const polyEndpoint = "0x3c2269811836af69497E5F486A85D7316753cf62";
task("bridgeUSDC-poly-bnb", "from polygon usdt to bsc usdt")
  .setAction(async (taskArgs, { ethers, network }) => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_MAINNET_URL);
    const deployerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractRouter = await ethers.getContractAt(stargatePolyABI, stargatePoly);
    const endpoint = await ethers.getContractAt(polyEndpointABI, polyEndpoint);
    const polyUSDT = await ethers.getContractAt(ERC20TOKEN, usdtPolyAddr);
    const feeData = await provider.getFeeData();

    const toBnbId = "102";
    const srcPoolPolyBnb = "2";
    const dstPoolPolyBnb = "2";
    const amountToSwap = '500000'; // USDC 6 decimals
    const minAmountToSwap = '400000'; // USDC 6 decimals
    const _lzTxParams = {
      dstGasForCall: 0,
      dstNativeAmount: 0,
      dstNativeAddr: ethers.utils.arrayify("0x0000000000000000000000000000000000000001")
    };

    balanceBefore = await polyUSDT.balanceOf(deployerWallet.address);
    const minPercentage = 0.9; // 90%
    const maxPercentage = 1.0; // 100%
    const minRange = balanceBefore.toNumber() * minPercentage;
    const maxRange = balanceBefore.toNumber() * maxPercentage;
    const randomBalance = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;

    console.log(balanceBefore.toString(), 'poly')

    const swapToAddress = ethers.utils.arrayify(deployerWallet.address);
    const payload = ethers.utils.arrayify("0x");

    // const argsForSwap = [toBnbId,srcPoolPolyBnb,dstPoolPolyBnb,deployerWallet.address,Math.floor(randomBalance),Math.floor(randomBalance * 0.9),_lzTxParams,swapToAddress,payload];

    // const fees = await endpoint.estimateFees(toBnbId,stargatePoly,"0x",false,"0x");

    // console.log('swap start');
    // const swap = await contractRouter.swap(...argsForSwap, {gasPrice: feeData.gasPrice, value: fees.nativeFee});
    // console.log('swap done');
    
    execSync('npx hardhat run ./scripts/checkingBalance.js --network bsc', { stdio: 'inherit' });

    return;
  });

task("check-usdt-bnb", "checking usdt balance on bsc")
  .setAction(async (taskArgs, { ethers, network }) => {
    await checkBalance(balanceBefore);
  });

task("bridgeUSDC-bnb-poly", "from bsc usdt to polygon usdt")
  .setAction(async (taskArgs, { ethers, network }) => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_MAINNET_URL);
    const deployerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractRouter = await ethers.getContractAt(stargatePolyABI, stargateBsc);

    const toPoly = "109";
    const srcPoolPolyBnb = "2";
    const dstPoolPolyBnb = "2";
    const amountToSwap = '1000000'; // USDC 6 decimals
    const minAmountToSwap = '900000'; // USDC 6 decimals
    const _lzTxParams = {
      dstGasForCall: 0,
      dstNativeAmount: 0,
      dstNativeAddr: ethers.utils.arrayify("0x0000000000000000000000000000000000000001")
    };

    const swapToAddress = ethers.utils.arrayify(deployerWallet.address);
    const payload = ethers.utils.arrayify("0x");

    const argsForSwap = [toPoly,srcPoolPolyBnb,dstPoolPolyBnb,deployerWallet.address,amountToSwap,minAmountToSwap,_lzTxParams,swapToAddress,payload];

    const swap = await contractRouter.swap(...argsForSwap);
    return;
  });