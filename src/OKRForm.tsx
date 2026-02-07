import "./App.css";
import { useContext, useState } from "react";
import * as React from "react";
import KeyResultForm from "./components/keyResultForm.tsx";
import KeyResultList from "./components/keyResultList.tsx";
import { KeyResultContext } from "./contexts/KeyResultProvider.tsx";
import { CircleCheckBigIcon } from "lucide-react";
import incubyteLogo from "./assets/incubyteLogo.png";

type OKRFormProps = {
  onClose: () => void;
  onSuccess: () => void;
};

function OKRForm({ onClose, onSuccess }: OKRFormProps) {
  const [objectiveState, setObjectiveState] = useState("");
  const [error, setError] = useState("");
  const keyResult = useContext(KeyResultContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!objectiveState.trim()) {
      setError("Objective is required");
      return;
    }
    setError("");
    console.log(objectiveState, keyResult);

    fetch("http://localhost:3002/objectives", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Objectives: objectiveState,
        keyValues: keyResult.keyResultList,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create OKR");
        }
        onSuccess();
        return res.json();
      })
      .then((data) => {
        console.log("Saved OKR:", data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleClear = () => {
    setObjectiveState("");
    setError("");
  };

  return (
    <div className="flex items-center justify-center rounded-2xl">
      <form
        className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-md w-96 transition-shadow hover:shadow-lg"
        onSubmit={handleSubmit}
      >
        <div>
          <button
            className={" relative top-1 left-74 text-black px-2 py-1 "}
            onClick={onClose}
          >
            ⛌
          </button>
        </div>
        <img
          src={incubyteLogo}
          alt="Incubyte"
          className=" h-10 w-auto object-contain"
        />
        <h1 className="text-2xl font-bold text-center">OKR</h1>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <CircleCheckBigIcon className="w-5 h-5 text-blue-500" />
            <label className="text-sm font-bold">objectives</label>
          </div>

          <input
            placeholder="Insert the objective"
            className={`border rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : ""}`}
            value={objectiveState}
            name="Values"
            onChange={(e) => {
              setObjectiveState(e.target.value);
              setError("");
            }}
          />
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>

        <KeyResultForm />

        <div className="flex gap-3 mt-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-200 hover:scale-105 active:scale-95"
            type="submit"
          >
            Submit
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        <KeyResultList />
      </form>
    </div>
  );
}

export default OKRForm;
