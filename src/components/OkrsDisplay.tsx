import type { OkrTypes } from "@/types/OKR_Types.ts";
import { Trash2, Hammer } from "lucide-react";

export type OKRProps = {
  objectives: OkrTypes[];
  onSuccess: () => void;
  onEdit: (objective: OkrTypes) => void;
  onAddKeyResult: (objective: OkrTypes) => void;
  onUpdateKeyResultCurrent: (
    objectiveId: number,
    keyResultId: number | null,
    value: number,
  ) => void;
};

const getProgressPercent = (current = 0, target = 0) => {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
};

const OkrsDisplay = ({
  objectives,
  onSuccess,
  onEdit,
  onAddKeyResult,
  onUpdateKeyResultCurrent,
}: OKRProps) => {
  if (!objectives || !Array.isArray(objectives)) {
    return <div className="p-4">No OKRs to display</div>;
  }
  const handleDelete = async (event: React.MouseEvent, id: number) => {
    event.preventDefault(); //look up TODO
    event.stopPropagation(); //look up
    const url = `http://localhost:3000/objectives/${id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to delete:", response.status, errorData);
        alert(
          `Failed to delete OKR: ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error("Error deleting OKR:", error);
      alert("Error deleting OKR. Please check the console for details.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      {objectives.map((objective) => {
        const objectiveProgressPercent =
          objective.keyResults.length === 0
            ? 0
            : Math.round(
                objective.keyResults.reduce((sum, keyResult) => {
                  const hasTarget =
                    keyResult.target && keyResult.target > 0;
                  const progressValue = hasTarget
                    ? getProgressPercent(
                        keyResult.current ?? 0,
                        keyResult.target ?? 0,
                      )
                    : (keyResult.progress ?? 0);
                  return sum + progressValue;
                }, 0) / objective.keyResults.length,
              );

        return (
          <div
            key={objective.id}
            className="relative border rounded-xl p-4 shadow-sm bg-white"
          >
            <button
              type="button"
              className="absolute top-3 right-11 z-10 text-blue-400 hover:text-blue-700 transition-colors cursor-pointer"
              onClick={() => onEdit(objective)}
              aria-label="EditOKR"
            >
              <Hammer />
            </button>

            <button
              type="button"
              className="absolute top-3 right-3 z-10 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              onClick={(event) => handleDelete(event, objective.id)}
              onPointerDown={(event) => event.stopPropagation()}
              aria-label="Delete OKR"
            >
              <Trash2 />
            </button>

            <div className="mb-4 flex flex-wrap items-center gap-3 pr-16">
              <h2 className="text-2xl font-extrabold tracking-tight">
                {objective.title}
              </h2>
              <span className="inline-flex items-center rounded-full bg-black text-white text-base font-semibold px-4 py-2">
                {objectiveProgressPercent}%
              </span>
            </div>

            <div className="space-y-2">
              {objective.keyResults?.map((keyResult, index) => {
                const current = keyResult.current ?? 0;
                const target = keyResult.target ?? 0;
                const metric = keyResult.metric ?? "";
                const progress =
                  target > 0
                    ? getProgressPercent(current, target)
                    : keyResult.progress ?? 0;

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{keyResult.description}</p>
                        <p className="text-sm text-gray-500">
                          {current} / {target} {metric} ({progress}%)
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-black"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <input
                      type="number"
                      className="mt-2 w-24 rounded-lg border px-2 py-1 text-sm"
                      value={current}
                      onChange={(event) => {
                        const newValue = Number(event.target.value) || 0;
                        onUpdateKeyResultCurrent(
                          objective.id,
                          keyResult.id,
                          newValue,
                        );
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              className="mt-3 w-full border rounded-xl py-2 text-sm font-semibold hover:bg-gray-100"
              onClick={() => onAddKeyResult(objective)}
            >
              + Add Key Result
            </button>
          </div>
        );
      })}
    </div>
  );
};
export default OkrsDisplay;
