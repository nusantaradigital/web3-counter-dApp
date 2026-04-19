"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../lib/abi.json";
import toast, { Toaster } from "react-hot-toast";

import Header from "../components/Header";
import CounterCard from "../components/CounterCard";
import WalletInfo from "../components/WalletInfo";
import HistoryList from "../components/HistoryList";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Home() {
  const [account, setAccount] = useState("");
  const [value, setValue] = useState(0);
  const [contract, setContract] = useState(null);
  const [loading, setloading] = useState(false);
  const [network, setNetwork] = useState(false);
  const [history, setHistory] = useState([]);

  
  async function connectWallet() {
  try {
    if (!window.ethereum) {
      toast.error("Install MetaMask dulu!");
      return;
    }

    // 🔥 FIX: gunakan chainId 31337 (0x7a69)
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x7a69" }],
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();
    const address = await signer.getAddress();

    const net = await provider.getNetwork();
    console.log("Network:", net);

    setNetwork(net.name || "localhost");

    const contract = new ethers.Contract(contractAddress, abi, signer);

    // 🔥 TARUH DI SINI
    console.log("ABI fragments:", contract.interface.fragments);
    console.log("Contract address:", contractAddress);

    setAccount(address);
    setContract(contract);

    toast.success("Wallet connected 🚀");
    } catch (err) {
    console.error("DETAIL ERROR:", err);
    toast.error("Gagal connect wallet ❌");
    }
  }

  function copyAddress() {
    if (!account) return;

    navigator.clipboard.writeText(account);
    toast.success("Address copied 📋");
  }

  // 🔥 PENTING: paksa ke network Hardhat (localhost)

  async function getValue() {
    if (!contract) return;
    const val = await contract.x();
    setValue(val.toString());
  }

  async function increment() {
  try {
    setloading(true);

    const txPromise = contract.inc();

    toast.promise(txPromise, {
      loading: "Transaction pending ⏳",
      success: "Increment berhasil 🚀",
      error: "Transaction gagal ❌",
    });

    const tx = await txPromise;
    await tx.wait();

    getValue();
    } catch (err) {
    console.error(err);
    } finally {
    setloading(false);
    }
  }

  useEffect(() => {
    if (!contract) return;

    const filter = contract.filters.Increment();

    const listener = (...args) => {
      const event = args[args.length - 1];

      console.log("FULL EVENT:", event);
      console.log("ARGS:", event.args);

      const user = event.args?.user;
      const value = event.args?.newValue;

      if (!user || !value) {
        console.error("Event tidak terbaca:", event.args);
        return;
      }

      setHistory((prev) => [
        {
          user: user.toString(),
          value: Number(value.toString()),
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    };

    contract.on(filter, listener);

    // 🔥 cleanup WAJIB
    return () => {
      contract.off(filter, listener);
    };
  }, [contract]);


  return (
    <main className="min-h-screen bg-black text-white p-6">

    <Header account={account} connectWallet={connectWallet} />

    <div className="grid md:grid-cols-2 gap-6">

      <CounterCard
        value={value}
        increment={increment}
        loading={loading}
        contract={contract}
      />

      <WalletInfo
        account={account}
        network={network}
        copyAddress={copyAddress}
      />

    </div>

    <HistoryList history={history} />

  </main>
  );
}