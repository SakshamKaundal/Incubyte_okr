import { useState } from "react";
import type { Objective } from "@/types/okr.types";
import { Trash2, Pencil } from "lucide-react";

type ObjectivesListProps = {
  objectives: Objective[];
  onRefresh: () => void;
  onEdit: (objective: Objective) => void;
  onAddKeyResult: (objective: Objective) => void;
};

const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
};

const ObjectivesList = ({
  objectives,
  onRefresh,
  onEdit,
  onAddKeyResult,
}: ObjectivesListProps) => {
  const [updatingKeyResult, setUpdatingKeyResult] = useState<string | null>(
    null,
  );

  if (!objectives || objectives.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No objectives yet. Create your first one!
      </div>
    );
  }

  const handleDeleteObjective = async (event: React.MouseEvent, id: number) => {
    event.preventDefault();
    event.stopPropagation();

    if (!confirm("Are you sure you want to delete this objective?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/objectives/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onRefresh();
      } else {
        alert("Failed to delete objective. Please try again.");
      }
    } catch {
      alert("Error deleting objective. Please try again.");
    }
  };

  const handleUpdateKeyResultProgress = async (
    objectiveId: number,
    keyResultId: number,
    newProgress: number,
  ) => {
    const updateKey = `${objectiveId}-${keyResultId}`;
    setUpdatingKeyResult(updateKey);

    try {
      const response = await fetch(
        `http://localhost:3000/objectives/${objectiveId}/key-results/${keyResultId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ progress: newProgress }),
        },
      );

      if (response.ok) {
        onRefresh();
      } else {
        alert("Failed to update progress. Please try again.");
      }
    } catch {
      alert("Error updating progress. Please try again.");
    } finally {
      setUpdatingKeyResult(null);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {objectives.map((objective) => {
        const objectiveProgress =
          objective.keyResults.length === 0
            ? 0
            : Math.round(
                objective.keyResults.reduce((sum, keyResult) => {
                  const progress = calculateProgress(
                    keyResult.progress,
                    keyResult.target,
                  );
                  return sum + progress;
                }, 0) / objective.keyResults.length,
              );

        const isComplete = objectiveProgress >= 100;

        return (
          <div
            key={objective.id}
            className={`relative rounded-xl border-2 p-4 shadow-sm transition-all ${
              isComplete
                ? "border-gray-300 bg-gray-50"
                : "border-green-400 bg-white"
            }`}
          >
            <button
              type="button"
              className="absolute top-3 right-11 z-10 text-blue-500 hover:text-blue-700 transition-colors"
              onClick={() => onEdit(objective)}
              aria-label="Edit objective"
            >
              <Pencil size={20} />
            </button>

            <button
              type="button"
              className="absolute top-3 right-3 z-10 text-red-500 hover:text-red-700 transition-colors"
              onClick={(event) => handleDeleteObjective(event, objective.id)}
              aria-label="Delete objective"
            >
              <Trash2 size={20} />
            </button>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 pr-16">
              <h2
                className={`text-2xl font-extrabold tracking-tight ${
                  isComplete ? "text-gray-500" : "text-gray-900"
                }`}
              >
                {objective.title}
              </h2>
              <span
                className={`inline-flex items-center rounded-full text-base font-semibold px-4 py-2 ${
                  isComplete
                    ? "bg-gray-200 text-gray-500"
                    : "bg-black text-white"
                }`}
              >
                {objectiveProgress}%
              </span>
            </div>

            <div className="space-y-2">
              {objective.keyResults.map((keyResult) => {
                const progress = calculateProgress(
                  keyResult.progress,
                  keyResult.target,
                );
                const isUpdating =
                  updatingKeyResult === `${objective.id}-${keyResult.id}`;

                return (
                  <div
                    key={keyResult.id}
                    className={`rounded-xl border p-3 ${
                      isComplete
                        ? "border-gray-200 bg-gray-100"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            isComplete ? "text-gray-500" : "text-black"
                          }`}
                        >
                          {keyResult.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {keyResult.progress} / {keyResult.target}{" "}
                          {keyResult.metric} ({progress}%)
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isComplete ? "bg-gray-300" : "bg-black"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        className={`w-24 rounded-lg border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                          isComplete
                            ? "border-gray-300 text-gray-500"
                            : "border-gray-300"
                        }`}
                        value={keyResult.progress}
                        onChange={(event) => {
                          const newValue = Number(event.target.value) || 0;
                          handleUpdateKeyResultProgress(
                            objective.id,
                            keyResult.id,
                            newValue,
                          );
                        }}
                        disabled={isUpdating}
                        min="0"
                        max={keyResult.target}
                      />
                      {isUpdating && (
                        <span className="text-xs text-gray-500">
                          Updating...
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="mt-3 w-full border rounded-xl py-2 text-sm font-semibold hover:bg-gray-100 transition-colors"
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

export default ObjectivesList;
