"use client";

export default function WalletInfo({ account, network, copyAddress }) {
  return (
    <div className="bg-white/5 p-6 rounded-2xl space-y-4">

      <div>
        <p className="text-gray-400 text-sm">Network</p>
        <p>{network || "Unknown"}</p>
      </div>

      <div>
        <p className="text-gray-400 text-sm">Wallet</p>

        {account ? (
          <div className="flex gap-2">
            <span className="font-mono text-sm">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>

            <button onClick={copyAddress}>
              Copy
            </button>
          </div>
        ) : (
          <p>Not connected</p>
        )}
      </div>

      <div>
        <p className="text-gray-400 text-sm">Status</p>
        <p className="text-green-400">Active</p>
      </div>

    </div>
  );
}