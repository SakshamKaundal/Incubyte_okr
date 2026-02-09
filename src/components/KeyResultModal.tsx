import Modal from "./Modal";

type KeyResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    current: string;
    target: string;
    metric: string;
  }) => void;
  title: string;
  current: string;
  target: string;
  metric: string;
  setTitle: (v: string) => void;
  setCurrent: (v: string) => void;
  setTarget: (v: string) => void;
  setMetric: (v: string) => void;
};

const KeyResultModal = ({
  isOpen,
  onClose,
  onSave,
  title,
  current,
  target,
  metric,
  setTitle,
  setCurrent,
  setTarget,
  setMetric,
}: KeyResultModalProps) => {
  return (
    <Modal isOpen={isOpen}>
      <div className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-xl font-bold">Add Key Result</h2>

        <input
          placeholder="Title"
          className="border rounded-xl px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Current"
          className="border rounded-xl px-3 py-2"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />
        <input
          placeholder="Target"
          className="border rounded-xl px-3 py-2"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <input
          placeholder="Metric (e.g. users, %)"
          className="border rounded-xl px-3 py-2"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        />

        <div className="flex gap-2 mt-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => onSave({ title, current, target, metric })}
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default KeyResultModal;
