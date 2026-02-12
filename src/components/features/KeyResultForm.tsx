import { useState } from "react";
import Modal from "@/components/ui/Modal";

type KeyResultFormProps = {
  isOpen: boolean;
  objectiveId: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

const KeyResultForm = ({
  isOpen,
  objectiveId,
  onClose,
  onSuccess,
}: KeyResultFormProps) => {
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState("");
  const [target, setTarget] = useState("");
  const [metric, setMetric] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setDescription("");
    setProgress("");
    setTarget("");
    setMetric("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!objectiveId) return;

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const progressValue = Number(progress) || 0;
    const targetValue = target.trim() === "" ? 100 : Number(target) || 100;
    const metricValue = metric.trim() || "%";

    try {
      const response = await fetch(
        `http://localhost:3000/objectives/${objectiveId}/key-results`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: description.trim(),
            progress: progressValue,
            target: targetValue,
            metric: metricValue,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add key result");
      }

      resetForm();
      onSuccess();
    } catch {
      setError("Failed to save key result");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-md w-96">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Key Result</h2>
          <button
            type="button"
            className="text-black px-2 py-1 hover:text-gray-600"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <input
          placeholder="Description"
          className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError("");
          }}
          disabled={isSubmitting}
        />

        <input
          placeholder="Current Progress"
          className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          type="number"
          min="0"
          disabled={isSubmitting}
        />

        <input
          placeholder="Target (default: 100)"
          className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          type="number"
          min="0"
          disabled={isSubmitting}
        />

        <input
          placeholder="Metric (e.g. users, %, items)"
          className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          disabled={isSubmitting}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2 mt-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={isSubmitting || !objectiveId}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default KeyResultForm;
