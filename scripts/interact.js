const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

    const Counter = await ethers.getContractFactory("Counter");
    const counter = await Counter.attach(contractAddress);

    // baca nilai awal
    let value = await counter.x();
    console.log("Initial value:", value.toString());

    // increment
    const tx = await counter.inc();
    await tx.wait();

    //baca lagi
    value = await counter.x();
    console.log("After increment:", value.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});