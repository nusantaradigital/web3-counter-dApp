"use client";

export default function Header({ account, connectWallet }) {
  return (
    <div className="flex justify-between items-center mb-10">
      <h1 className="text-white text-2xl font-bold">
        ⚡ Web3 Dashboard
      </h1>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 px-4 py-2 rounded-lg"
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
  );
}