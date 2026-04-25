"use client";

export default function HistoryList({ history }) {
  return (
    <div className="mt-6 bg-white/5 p-6 rounded-2xl">
      <p className="text-gray-400 text-sm mb-4">Transaction History</p>

      {history.length === 0 ? (
        <p className="text-gray-500">No transactions yet</p>
      ) : (
        history.map((tx, i) => (
          <div key={i} className="flex justify-between text-sm mb-2">
            <span className="font-mono">
              {tx.user.slice(0, 6)}...{tx.user.slice(-4)}
            </span>
            <span>+1 → {tx.value}</span>
            <span>{tx.time}</span>
          </div>
        ))
      )}
    </div>
  );
}