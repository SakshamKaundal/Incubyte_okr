import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Sparkles } from "lucide-react";
import type { Objective } from "@/types/okr.types";

type AIGeneratorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (objective: Objective) => void;
};

interface GeneratedOKR {
  objective: string;
  keyResults: Array<{
    description: string;
    progress: number;
    target: number;
    metric: string;
  }>;
}

const AIGeneratorModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AIGeneratorModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedOKR, setGeneratedOKR] = useState<GeneratedOKR | null>(null);
  const [editedOKR, setEditedOKR] = useState<GeneratedOKR | null>(null);

  const handleGenerateOKR = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/ai/generate-okr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate OKR");
      }

      const data: GeneratedOKR = await response.json();
      setGeneratedOKR(data);
      setEditedOKR(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate OKR");
      setGeneratedOKR(null);
      setEditedOKR(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditKeyResult = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    if (!editedOKR) return;

    const updatedKeyResults = [...editedOKR.keyResults];
    if (field === "description") {
      updatedKeyResults[index].description = value as string;
    } else if (field === "progress") {
      updatedKeyResults[index].progress = parseInt(value as string) || 0;
    } else if (field === "target") {
      updatedKeyResults[index].target = parseInt(value as string) || 0;
    } else if (field === "metric") {
      updatedKeyResults[index].metric = value as string;
    }

    setEditedOKR({
      ...editedOKR,
      keyResults: updatedKeyResults,
    });
  };

  const handleEditObjective = (value: string) => {
    if (!editedOKR) return;
    setEditedOKR({
      ...editedOKR,
      objective: value,
    });
  };

  const handleSubmitOKR = async () => {
    if (!editedOKR || !editedOKR.objective.trim()) {
      setError("Objective title is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create the objective
      const objectiveResponse = await fetch(
        "http://localhost:3000/objectives",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: editedOKR.objective.trim() }),
        },
      );

      if (!objectiveResponse.ok) {
        throw new Error("Failed to create objective");
      }

      const createdObjective: Objective = await objectiveResponse.json();

      // Create all key results
      for (const kr of editedOKR.keyResults) {
        const krResponse = await fetch(
          `http://localhost:3000/objectives/${createdObjective.id}/key-results`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              description: kr.description.trim(),
              progress: kr.progress,
              target: kr.target,
              metric: kr.metric.trim(),
            }),
          },
        );

        if (!krResponse.ok) {
          throw new Error("Failed to create key result");
        }
      }

      // Fetch the complete objective with key results
      const completeResponse = await fetch(
        `http://localhost:3000/objectives/${createdObjective.id}`,
      );
      if (!completeResponse.ok) {
        throw new Error("Failed to fetch created objective");
      }

      const completeObjective: Objective = await completeResponse.json();

      onSuccess(completeObjective);
      resetForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save objective");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPrompt("");
    setGeneratedOKR(null);
    setEditedOKR(null);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold">AI OKR Generator</h2>
          </div>
          <button
            type="button"
            className="text-black px-2 py-1 hover:text-gray-600"
            onClick={handleClose}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {!generatedOKR ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-600">
              Describe your goal or objective, and AI will generate OKRs for
              you.
            </p>

            <textarea
              placeholder="e.g., Increase customer engagement on our mobile app by improving user retention and feature adoption"
              className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-h-24 resize-none"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setError("");
              }}
              disabled={isLoading}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleGenerateOKR}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate OKR
                </>
              )}
            </button>
          </div>
        ) : editedOKR ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Objective
              </label>
              <textarea
                className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={editedOKR.objective}
                onChange={(e) => handleEditObjective(e.target.value)}
                disabled={isLoading}
                rows={2}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Key Results ({editedOKR.keyResults.length})
              </label>
              <div className="space-y-3">
                {editedOKR.keyResults.map((kr, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 bg-gray-50 space-y-2"
                  >
                    <input
                      type="text"
                      placeholder="Key Result Description"
                      className="w-full border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      value={kr.description}
                      onChange={(e) =>
                        handleEditKeyResult(
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      disabled={isLoading}
                    />

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">
                          Progress
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          value={kr.progress}
                          onChange={(e) =>
                            handleEditKeyResult(
                              index,
                              "progress",
                              e.target.value,
                            )
                          }
                          disabled={isLoading}
                          min="0"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="text-xs text-gray-600">Target</label>
                        <input
                          type="number"
                          placeholder="100"
                          className="w-full border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          value={kr.target}
                          onChange={(e) =>
                            handleEditKeyResult(index, "target", e.target.value)
                          }
                          disabled={isLoading}
                          min="0"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="text-xs text-gray-600">Metric</label>
                        <input
                          type="text"
                          placeholder="%"
                          className="w-full border rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          value={kr.metric}
                          onChange={(e) =>
                            handleEditKeyResult(index, "metric", e.target.value)
                          }
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all disabled:opacity-50"
                onClick={() => {
                  setGeneratedOKR(null);
                  setEditedOKR(null);
                  setPrompt("");
                }}
                disabled={isLoading}
              >
                Generate Again
              </button>

              <button
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmitOKR}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save OKR"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default AIGeneratorModal;
