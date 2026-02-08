import type { KeyResult } from "../types/OKR_Types.ts";
import { useContext, useState } from "react";
import { KeyResultContext } from "../contexts/KeyResultProvider.tsx";
import { BookCheckIcon, ChartNoAxesCombinedIcon } from "lucide-react";

const KeyResultForm = () => {
  const [keyResult, setKeyResult] = useState<KeyResult>({
    isCompleted: false,
    id: 0,
    description: "",
    progress: 0,
  });
  const [error, setError] = useState("");
  const { setKeyResultList } = useContext(KeyResultContext);

  const handleAdd = () => {
    if (!keyResult.description.trim()) {
      setError("Key result is required");
      return;
    }
    const n = Number(keyResult.progress);
    if (keyResult.progress === -1 || n < 0 || n > 100) {
      setError("Progress must be 0–100");
      return;
    }
    setError("");
    setKeyResultList((list: KeyResult[]) => [
      ...list,
      { ...keyResult, id: Date.now() },
    ]);
    setKeyResult({ isCompleted: false, id: 0, description: "", progress: 0 });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <BookCheckIcon className="w-5 h-5 text-red-500" />
        <label className="text-sm font-bold">Key Result</label>
      </div>
      <input
        placeholder="Enter the key result"
        className={`border rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : ""}`}
        value={keyResult.description}
        onChange={(e) => {
          setKeyResult((prev: KeyResult) => ({
            ...prev,
            description: e.target.value,
          }));
          setError("");
        }}
      />
      <div className="flex items-center gap-1">
        <ChartNoAxesCombinedIcon className="w-5 h-5 text-green-500" />
        <label className="text-sm font-bold">Progress</label>
      </div>
      <input
  type="number"
  min={0}
  max={100}
  placeholder="0–100"
  className={`border rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
    error ? "border-red-500" : ""
  }`}
  value={keyResult.progress}
  onChange={(e) => {
    const raw = e.target.value;

    // allow empty input (user is typing)
    if (raw === "") {
      setKeyResult((prev) => ({ ...prev, progress: 0 }));
      setError("");
      return;
    }

    const value = Number(raw);

    if (Number.isNaN(value)) return;

    const clamped = Math.min(100, Math.max(0, value));

    setKeyResult((prev) => ({
      ...prev,
      progress: clamped,
    }));

    setError("");
  }}
/>

      {error && <span className="text-sm text-red-500">{error}</span>}
      <button
        type="button"
        className="rounded-md px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};
export default KeyResultForm;
