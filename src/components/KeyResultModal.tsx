import { useState } from "react";
import Modal from "./Modal";

type KeyResultModalProps = {
  isOpen: boolean;
  objectiveId: number | null;
  onClose: () => void;
  onSuccess: () => void;
};

const KeyResultModal = ({
  isOpen,
  objectiveId,
  onClose,
  onSuccess,
}: KeyResultModalProps) => {
  const [description, setDescription] = useState("");
  const [current, setCurrent] = useState("");
  const [target, setTarget] = useState("");
  const [metric, setMetric] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setDescription("");
    setCurrent("");
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
    setIsSaving(true);

    const currentValue = Number(current) || 0;
    const targetValue =
      target.trim() === "" ? 100 : Number(target) || 0;
    const metricValue = metric.trim() || "%";

    try {
      const response = await fetch(
        `http://localhost:3000/objectives/${objectiveId}/key-results`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: description.trim(),
            progress: currentValue,
            target: targetValue,
            metric: metricValue,
          }),
        },
      );
      console.log(response.body)
      if (!response.ok) {
        throw new Error(`Failed to add key result: ${response.status}`);
      }

      resetForm();
      onSuccess();
    } catch (saveError) {
      console.error("Failed to save key result:", saveError);
      setError("Failed to save key result");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-xl font-bold">Add Key Result</h2>

        <input
          placeholder="Description"
          className="border rounded-xl px-3 py-2"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setError("");
          }}
        />
        <input
          placeholder="Current Progress"
          className="border rounded-xl px-3 py-2"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          type="number"
        />
        <input
          placeholder="Target"
          className="border rounded-xl px-3 py-2"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          type="number"
        />
        <input
          placeholder="Metric (e.g. users, %)"
          className="border rounded-xl px-3 py-2"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <div className="flex gap-2 mt-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-60"
            onClick={handleSave}
            disabled={isSaving || !objectiveId}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default KeyResultModal;
