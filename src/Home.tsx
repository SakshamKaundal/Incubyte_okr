import OKRForm from "@/OKRForm.tsx";
import Modal from "@/components/Modal.tsx";
import { useEffect, useState } from "react";
import OkrsDisplay from "@/components/OkrsDisplay.tsx";
import KeyResultModal from "@/components/KeyResultModal.tsx";
import type { KeyResult, OkrTypes } from "@/types/OKR_Types.ts";
import incubyteLogo from "@/assets/incubyteLogo.png";

const Home = () => {
  const [objectives, setObjectives] = useState<OkrTypes[]>([]);
  const [editingObjective, setEditingObjective] = useState<OkrTypes | null>(
    null,
  );
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);

  const [isKeyResultModalOpen, setIsKeyResultModalOpen] = useState(false);
  const [keyResultObjectiveId, setKeyResultObjectiveId] = useState<
    number | null
  >(null);

  const updateKeyResultProgress = (
    objectiveId: number,
    keyResultId: number | null,
    value: number,
  ) => {
    if (!keyResultId) return;

    setObjectives((prev) =>
      prev.map((objective) => {
        if (objective.id !== objectiveId) return objective;
        return {
          ...objective,
          keyResults: objective.keyResults.map((keyResult) =>
            keyResult.id === keyResultId
              ? { ...keyResult, progress: value }
              : keyResult,
          ),
        };
      }),
    );
  };

  const fetchObjectives = async (): Promise<OkrTypes[]> => {
    const res = await fetch("http://localhost:3000/objectives");
    if (!res.ok) {
      throw new Error(`Failed to fetch objectives: ${res.status}`);
    }
    const data = await res.json();
    return data.map((item: OkrTypes) => ({
      id: item.id,
      title: item.title,
      keyResults:
        item.keyResults?.map((keyResult: KeyResult) => ({
          id: keyResult.id,
          description: keyResult.description ?? "",
          progress: keyResult.progress ?? 0,
          isCompleted: keyResult.isCompleted ?? false,
          target: keyResult.target ?? 0,
          metric: keyResult.metric ?? "",
        })) ?? [],
    }));
  };

  const refreshObjectives = () =>
    fetchObjectives()
      .then((mapped) => {
        setObjectives(mapped);
        return mapped;
      })
      .catch((error) => {
        console.error("Failed to fetch objectives:", error);
        return [];
      });

  useEffect(() => {
    let cancelled = false;

    fetchObjectives()
      .then((mapped) => {
        if (!cancelled) {
          setObjectives(mapped);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to fetch objectives:", error);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-10">
      <header className="pt-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={incubyteLogo}
              alt="Incubyte"
              className="h-10 w-10 rounded-xl object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Objectives & Key Results
              </h1>
              <p className="text-sm text-gray-500">
                Track progress with clear targets
              </p>
            </div>
          </div>
          {!isObjectiveModalOpen ? (
            <button
              className="rounded-2xl border border-black bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900"
              onClick={() => {
                setIsObjectiveModalOpen(true);
              }}
            >
              Add Objective
            </button>
          ) : null}
        </div>
      </header>

      <OkrsDisplay
        objectives={objectives}
        onSuccess={refreshObjectives}
        onEdit={(objective) => {
          setEditingObjective(objective);
          setIsObjectiveModalOpen(true);
        }}
        onAddKeyResult={(objective) => {
          setKeyResultObjectiveId(objective.id);
          setIsKeyResultModalOpen(true);
        }}
        onUpdateKeyResultProgress={updateKeyResultProgress}
      />
      <Modal isOpen={isObjectiveModalOpen}>
        <OKRForm
          key={editingObjective?.id ?? "new"}
          editData={editingObjective || undefined}
          onClose={() => {
            setIsObjectiveModalOpen(false);
            setEditingObjective(null);
          }}
          onSuccess={() => {
            refreshObjectives();
            setIsObjectiveModalOpen(false);
            setEditingObjective(null);
          }}
        />
      </Modal>

      <KeyResultModal
        isOpen={isKeyResultModalOpen}
        objectiveId={keyResultObjectiveId}
        onClose={() => {
          setIsKeyResultModalOpen(false);
          setKeyResultObjectiveId(null);
        }}
        onSuccess={() => {
          refreshObjectives();
          setIsKeyResultModalOpen(false);
          setKeyResultObjectiveId(null);
        }}
      />
    </div>
  );
};
export default Home;
