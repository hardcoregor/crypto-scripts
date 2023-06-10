const dotenv = require('dotenv');

+ require("@nomicfoundation/hardhat-toolbox");

require("./tasks/bridgeStargate");

dotenv.config();

const {
  POLYGON_MAINNET_URL,
  PRIVATE_KEY
} = process.env;

module.exports = {
  solidity: "0.8.18",
  networks: {
    poly: {
        url: POLYGON_MAINNET_URL,
        accounts: [PRIVATE_KEY],
        gasPrice: 0,
        blockConfirmations: 6,
    },
  }
};
