import { useState } from "react";
import { CircleCheckBigIcon } from "lucide-react";
import incubyteLogo from "@/assets/incubyteLogo.png";
import type { Objective } from "@/types/okr.types";

type ObjectiveFormProps = {
  onClose: () => void;
  onSuccess: () => void;
  editData?: Objective;
};

function ObjectiveForm({ onClose, onSuccess, editData }: ObjectiveFormProps) {
  const [title, setTitle] = useState(editData?.title ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(editData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Objective is required");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const url = isEditMode
      ? `http://localhost:3000/objectives/${editData?.id}`
      : "http://localhost:3000/objectives";

    const method = isEditMode ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditMode ? "update" : "create"} objective`,
        );
      }

      onSuccess();
    } catch {
      setError(`Failed to ${isEditMode ? "update" : "save"} objective`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setTitle("");
    setError("");
  };

  return (
    <div className="flex items-center justify-center rounded-2xl">
      <form
        className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-md w-96 transition-shadow hover:shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-end">
          <button
            type="button"
            className="text-black px-2 py-1 hover:text-gray-600"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <img
          src={incubyteLogo}
          alt="Incubyte"
          className="h-10 w-auto object-contain"
        />

        <h1 className="text-2xl font-bold text-center">
          {isEditMode ? "Edit Objective" : "Add A New Objective"}
        </h1>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <CircleCheckBigIcon className="w-5 h-5 text-blue-500" />
            <label className="text-sm font-bold">Objective</label>
          </div>

          <input
            placeholder="Enter objective title"
            className={`border rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : ""
            }`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            disabled={isSubmitting}
          />
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>

        <div className="flex gap-3 mt-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Add"}
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
            onClick={handleClear}
            disabled={isSubmitting}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default ObjectiveForm;
