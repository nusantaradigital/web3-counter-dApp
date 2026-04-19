"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../lib/abi.json";
import toast, { Toaster } from "react-hot-toast";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

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
    <main className="min-h-screen bg-[#f1f1f1] text-white p-6">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-20 blur-3xl rounded-full"></div>

    {/* HEADER */}
    <div className="flex justify-between items-center mb-10">
      <h1 className="text-white text-2xl font-bold tracking-tight">
        ⚡ Web3 Dashboard
      </h1>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
        >
          Connect
        </button>
      ) : (
        <div className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
      )}
    </div>

    {/* MAIN GRID */}
    <div className="grid md:grid-cols-2 gap-6">

      {/* CARD VALUE */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl hover:scale-[1.02] transition">
  
        <p className="text-gray-400 text-sm">Counter Value</p>

        <div className="text-6xl font-bold mt-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent transition-all duration-300">
        {value}
        </div>

        <button
          onClick={increment}
          disabled={!contract || loading}
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 disabled:opacity-50 px-4 py-3 rounded-xl font-semibold shadow-lg transition"
          >
          {loading ? "Processing..." : "Increment 🚀"}
        </button>

      </div>

      {/* INFO PANEL */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">

        <div>
          <p className="text-gray-400 text-sm">Network</p>
          <p className="text-white font-semibold capitalize">
            {network || "Unknown"}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Wallet</p>

          {account ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>

              <button
                onClick={copyAddress}
                className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20"
                >
                Copy
              </button>
            </div>

          ) : (
            <p className="text-gray-500 text-sm">Not connected</p>
          )}

        </div>

        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <p className="text-green-400">Active</p>
        </div>

      </div>

      {/* 🔥 TARUH DI SINI (HISTORY) */}
    <div className="mt-6 bg-white/5 p-4 rounded-xl max-h-60 overflow-y-auto">
      <p className="text-gray-400 text-sm mb-2">Transaction History</p>

      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">No transactions yet</p>
      ) : (
        history.map((tx, index) => (
          <div
            key={index}
            className="text-sm flex justify-between border-b border-white/10 py-2"
          >
            <span className="font-mono">
              {typeof tx.user === "string"
              ? `${tx.user.slice(0, 6)}...${tx.user.slice(-4)}`
              : "Invalid address"}
            </span>
            <span>+1 → {tx.value}</span>
            <span className="text-gray-500">{tx.time}</span>
          </div>
        ))
      )}
      </div>

    </div>

    </main>
  );
}