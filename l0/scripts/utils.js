const dotenv = require("dotenv");
dotenv.config();

const ERC20TOKEN = require("../contracts/ABI/ERC20TOKEN.json");
const usdtBnbAddr = "0x55d398326f99059ff775485246999027b3197955";


const checkBalance = async (_balanceBefore) => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.BSC_MAINNET_URL);
  const deployerWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const polyUSDT = await ethers.getContractAt(ERC20TOKEN, usdtBnbAddr);
  let balance = await polyUSDT.balanceOf(deployerWallet.address);

  while (balance / 1e12 > (_balanceBefore * 0.8)) {
    console.log("Balance is 0. Waiting for 1 minute...");
    await sleep(30000);
    balance = await polyUSDT.balanceOf(deployerWallet.address);
  }

  console.log("Balance is not 0:", balance / 1e12);
};

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = { checkBalance };