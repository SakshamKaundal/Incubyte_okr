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
  const [keyResultObjective, setKeyResultObjective] =
    useState<OkrTypes | null>(null);
  const [keyResultTitle, setKeyResultTitle] = useState("");
  const [keyResultCurrent, setKeyResultCurrent] = useState("");
  const [keyResultTarget, setKeyResultTarget] = useState("");
  const [keyResultMetric, setKeyResultMetric] = useState("");

  const updateKeyResultCurrent = (
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
              ? { ...keyResult, current: value }
              : keyResult,
          ),
        };
      }),
    );
  };

  const fetchObjectives = async () => {
    const res = await fetch("http://localhost:3000/objectives");
    const data = await res.json();
    console.log(data);
    const mapped = data.map((item: OkrTypes) => ({
      id: item.id,
      title: item.title,
      keyResults:
        item.keyResults?.map((keyResult: KeyResult) => ({
          id: keyResult.id,
          description: keyResult.description,
          progress: keyResult.progress,
          isCompleted: keyResult.isCompleted,
        })) ?? [],
    }));

    setObjectives(mapped);
  };

  useEffect(() => {
    fetchObjectives().then((result) => {
      console.log(result);
    });
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
        onSuccess={fetchObjectives}
        onEdit={(objective) => {
          setEditingObjective(objective);
          setIsObjectiveModalOpen(true);
        }}
        onAddKeyResult={(objective) => {
          setKeyResultObjective(objective);
          setKeyResultTitle("");
          setKeyResultCurrent("");
          setKeyResultTarget("");
          setKeyResultMetric("");
          setIsKeyResultModalOpen(true);
        }}
        onUpdateKeyResultCurrent={updateKeyResultCurrent}
      />
      <Modal isOpen={isObjectiveModalOpen}>
        <OKRForm
          editData={editingObjective || undefined}
          onClose={() => {
            setIsObjectiveModalOpen(false);
            setEditingObjective(null);
          }}
          onSuccess={() => {
            fetchObjectives();
            setIsObjectiveModalOpen(false);
            setEditingObjective(null);
          }}
        />
      </Modal>

      <KeyResultModal
        isOpen={isKeyResultModalOpen}
        onClose={() => setIsKeyResultModalOpen(false)}
        onSave={(data) => {
          if (!keyResultObjective) return;

          const current = Number(data.current) || 0;
          const target = Number(data.target) || 0;
          const progress = target > 0 ? Math.round((current / target) * 100) : 0;

          const newKeyResult = {
            id: Date.now(),
            description: data.title,
            progress,
            isCompleted: target > 0 && current >= target,
            current,
            target,
            metric: data.metric || "",
          };

          setObjectives((prev) =>
            prev.map((objective) =>
              objective.id === keyResultObjective.id
                ? {
                    ...objective,
                    keyResults: [...objective.keyResults, newKeyResult],
                  }
                : objective,
            ),
          );

          setIsKeyResultModalOpen(false);
        }}
        title={keyResultTitle}
        current={keyResultCurrent}
        target={keyResultTarget}
        metric={keyResultMetric}
        setTitle={setKeyResultTitle}
        setCurrent={setKeyResultCurrent}
        setTarget={setKeyResultTarget}
        setMetric={setKeyResultMetric}
      />
    </div>
  );
};
export default Home;
