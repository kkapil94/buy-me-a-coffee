// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // We get the contract to deploy.
  const BuyMeACoffee = await hre.ethers.deployContract("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.waitForDeployment();
  console.log("BuyMeACoffee deployed to:", buyMeACoffee.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });