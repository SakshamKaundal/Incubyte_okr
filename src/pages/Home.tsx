import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import ObjectiveForm from "@/components/features/ObjectiveForm";
import ObjectivesList from "@/components/features/ObjectivesList";
import KeyResultForm from "@/components/features/KeyResultForm";
import type { Objective } from "@/types/okr.types";
import incubyteLogo from "@/assets/incubyteLogo.png";

const Home = () => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(
    null,
  );
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [isKeyResultModalOpen, setIsKeyResultModalOpen] = useState(false);
  const [keyResultObjectiveId, setKeyResultObjectiveId] = useState<
    number | null
  >(null);

  const fetchObjectives = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/objectives");
      if (!response.ok) {
        throw new Error("Failed to fetch objectives");
      }
      const data = await response.json();
      setObjectives(data);
    } catch (error) {
      console.error("Error fetching objectives:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseObjectiveModal = () => {
    setIsObjectiveModalOpen(false);
    setEditingObjective(null);
  };

  const handleCloseKeyResultModal = () => {
    setIsKeyResultModalOpen(false);
    setKeyResultObjectiveId(null);
  };

  const handleObjectiveSuccess = () => {
    fetchObjectives();
    handleCloseObjectiveModal();
  };

  const handleKeyResultSuccess = () => {
    fetchObjectives();
    handleCloseKeyResultModal();
  };

  const handleEditObjective = (objective: Objective) => {
    setEditingObjective(objective);
    setIsObjectiveModalOpen(true);
  };

  const handleAddKeyResult = (objective: Objective) => {
    setKeyResultObjectiveId(objective.id);
    setIsKeyResultModalOpen(true);
  };

  useEffect(() => {
    fetchObjectives();
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
          <button
            className="rounded-2xl border border-black bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-900"
            onClick={() => setIsObjectiveModalOpen(true)}
          >
            Add Objective
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : (
        <ObjectivesList
          objectives={objectives}
          onRefresh={fetchObjectives}
          onEdit={handleEditObjective}
          onAddKeyResult={handleAddKeyResult}
        />
      )}

      <Modal isOpen={isObjectiveModalOpen}>
        <ObjectiveForm
          key={editingObjective?.id ?? "new"}
          editData={editingObjective || undefined}
          onClose={handleCloseObjectiveModal}
          onSuccess={handleObjectiveSuccess}
        />
      </Modal>

      <KeyResultForm
        isOpen={isKeyResultModalOpen}
        objectiveId={keyResultObjectiveId}
        onClose={handleCloseKeyResultModal}
        onSuccess={handleKeyResultSuccess}
      />
    </div>
  );
};

export default Home;
