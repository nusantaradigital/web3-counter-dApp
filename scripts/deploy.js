const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying Counter...");

    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();

    await counter.deployTransaction.wait();

    console.log("Counter deployed to:", counter.address);
}

main().catch((error) => {
    console.error("ERROR", error);
    process.exitCode = 1;
});