"use client";

export default function CounterCard({ value, increment, loading, contract }) {
  return (
    <div className="bg-white/10 p-6 rounded-2xl">
      <p className="text-gray-400 text-sm">Counter Value</p>

      <div className="text-6xl font-bold mt-2">
        {value}
      </div>

      <button
        onClick={increment}
        disabled={!contract || loading}
        className="mt-6 w-full bg-blue-500 px-4 py-3 rounded-xl"
      >
        {loading ? "Processing..." : "Increment 🚀"}
      </button>
    </div>
  );
}