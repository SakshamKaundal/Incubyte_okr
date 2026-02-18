import { useState } from "react";
import type { Objective } from "@/types/okr.types";
import { Trash2, Check } from "lucide-react";

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
  const [editingProgress, setEditingProgress] = useState<{
    objectiveId: number;
    keyResultId: number;
    newValue: number;
  } | null>(null);
  const [updatingKeyResult, setUpdatingKeyResult] = useState<string | null>(
    null,
  );
  const [deletingKeyResult, setDeletingKeyResult] = useState<string | null>(
    null,
  );

  if (!objectives || objectives.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
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
      });

      if (response.ok) {
        onRefresh();
      } else {
        alert("Failed to delete objective");
      }
    } catch {
      alert("Error deleting objective");
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
        setEditingProgress(null);
        onRefresh();
      } else {
        alert("Failed to update progress");
      }
    } catch {
      alert("Error updating progress");
    } finally {
      setUpdatingKeyResult(null);
    }
  };

  const handleDeleteKeyResult = async (
    event: React.MouseEvent,
    objectiveId: number,
    keyResultId: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!confirm("Are you sure you want to delete this key result?")) {
      return;
    }

    const deleteKey = `${objectiveId}-${keyResultId}`;
    setDeletingKeyResult(deleteKey);

    try {
      const response = await fetch(
        `http://localhost:3000/objectives/${objectiveId}/key-results/${keyResultId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        onRefresh();
      } else {
        alert("Failed to delete key result");
      }
    } catch {
      alert("Error deleting key result");
    } finally {
      setDeletingKeyResult(null);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {objectives.map((objective) => {
        const objectiveProgress =
          objective.keyResults.length === 0
            ? 0
            : Math.floor(
                objective.keyResults.reduce((sum, keyResult) => {
                  const progress = calculateProgress(
                    keyResult.progress,
                    keyResult.target,
                  );
                  return sum + progress;
                }, 0) / objective.keyResults.length,
              );

        const isComplete = objectiveProgress === 100;

        return (
          <div
            key={objective.id}
            className={`relative rounded-xl border-2 p-4 shadow-sm transition-all ${
              isComplete ? "border-muted bg-muted" : "border-green-400 bg-card"
            }`}
          >
            <button
              type="button"
              className="absolute top-3 right-11 z-10 text-blue-500 hover:text-blue-700"
              onClick={() => onEdit(objective)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path>
              </svg>
            </button>

            <button
              type="button"
              className="absolute top-3 right-3 z-10 text-red-500 hover:text-red-700"
              onClick={(event) => handleDeleteObjective(event, objective.id)}
            >
              <Trash2 size={20} />
            </button>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 pr-16">
              <h2
                className={`text-2xl font-extrabold ${
                  isComplete ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {objective.title}
              </h2>
              <span
                className={`inline-flex items-center rounded-full text-base font-semibold px-4 py-2 ${
                  isComplete
                    ? "bg-muted text-muted-foreground"
                    : "bg-foreground text-background"
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
                const isDeleting =
                  deletingKeyResult === `${objective.id}-${keyResult.id}`;
                const isEditing =
                  editingProgress?.objectiveId === objective.id &&
                  editingProgress?.keyResultId === keyResult.id;
                const currentValue = isEditing
                  ? editingProgress.newValue
                  : keyResult.progress;

                return (
                  <div
                    key={keyResult.id}
                    className={`rounded-xl border p-3 ${
                      isComplete
                        ? "border-muted bg-muted"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            isComplete
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {keyResult.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {currentValue} / {keyResult.target} {keyResult.metric}{" "}
                          ({calculateProgress(currentValue, keyResult.target)}%)
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 ml-2 disabled:opacity-50"
                        onClick={(event) =>
                          handleDeleteKeyResult(
                            event,
                            objective.id,
                            keyResult.id,
                          )
                        }
                        disabled={isDeleting || isUpdating}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isComplete ? "bg-muted-foreground" : "bg-foreground"
                        }`}
                        style={{
                          width: `${calculateProgress(currentValue, keyResult.target)}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        className="w-24 rounded-lg border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring bg-background text-foreground border-border"
                        value={currentValue}
                        onChange={(event) => {
                          const newValue = Number(event.target.value) || 0;
                          setEditingProgress({
                            objectiveId: objective.id,
                            keyResultId: keyResult.id,
                            newValue: Math.min(newValue, keyResult.target),
                          });
                        }}
                        disabled={isUpdating || isDeleting}
                        min="0"
                        max={keyResult.target}
                      />

                      {isEditing && currentValue !== keyResult.progress && (
                        <button
                          type="button"
                          className="h-8 w-8 flex items-center justify-center rounded-lg bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                          onClick={() =>
                            handleUpdateKeyResultProgress(
                              objective.id,
                              keyResult.id,
                              currentValue,
                            )
                          }
                          disabled={isUpdating}
                        >
                          <Check size={18} />
                        </button>
                      )}

                      {isUpdating && (
                        <span className="text-xs text-muted-foreground">
                          Updating...
                        </span>
                      )}

                      {isDeleting && (
                        <span className="text-xs text-red-500">
                          Deleting...
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="mt-3 w-full border rounded-xl py-2 text-sm font-semibold hover:bg-accent transition-colors"
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
