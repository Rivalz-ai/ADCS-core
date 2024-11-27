const hre = require("hardhat");

async function main() {
  console.log("Deploying MemeCoinsManager contract...");

  // Get the ContractFactory and Signers
  const MemeCoinsManager = await hre.ethers.getContractFactory("MemeCoinsManager");
  const [deployer] = await hre.ethers.getSigners();

  // Deploy the contract
  const memeCoinsManager = await MemeCoinsManager.deploy();

  // Wait for the contract to be deployed
  await memeCoinsManager.deployed();

  console.log("MemeCoinsManager deployed to:", memeCoinsManager.address);
  console.log("Deployed by:", deployer.address);

  // Verify the contract on Etherscan
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await memeCoinsManager.deployTransaction.wait(6);
    console.log("Verifying contract on Etherscan...");
    await hre.run("verify:verify", {
      address: memeCoinsManager.address,
      constructorArguments: [],
    });
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });