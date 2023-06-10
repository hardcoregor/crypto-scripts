const { task, run } = require("hardhat");

async function main() {
  await run("bridgeUSDC-poly-bnb");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });