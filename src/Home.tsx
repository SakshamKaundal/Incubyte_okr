import OKRForm from "@/OKRForm.tsx";
import Modal from "@/components/Modal.tsx";
import { useEffect, useState } from "react";
import OkrsDisplay from "@/components/OkrsDisplay.tsx";
import type { KeyResult, OkrTypes } from "@/types/OKR_Types.ts";

const Home = () => {
  const [okrList, setOkrList] = useState([]);
  const [editingOkr, setEditingOkr] = useState<OkrTypes | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchOkrs = async () => {
    const res = await fetch("http://localhost:3000/objectives");
    const data = await res.json();
    console.log(data);
    const mapped = data.map((item: OkrTypes) => ({
      id: item.id,
      title: item.title,
      keyResults:
        item.keyResults?.map((kr: KeyResult) => ({
          id: kr.id,
          description: kr.description,
          progress: kr.progress,
          isCompleted: kr.isCompleted,
        })) ?? [],
    }));

    setOkrList(mapped);
  };

  useEffect(() => {
    fetchOkrs().then((r) => {
      console.log(r);
    });
  }, []);

  return (
    <>
      {!isOpen ? (
        <button
          className={"bg-black border rounded-2xl text-white px-2 py-1 m-3"}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          ADD OKR
        </button>
      ) : null}

      <OkrsDisplay
        okrs={okrList}
        onSuccess={fetchOkrs}
        onEdit={(okr) => {
          setEditingOkr(okr);
          setIsOpen(true);
        }}
      />
      <Modal isOpen={isOpen}>
        <OKRForm
          editData={editingOkr || undefined}
          onClose={() => {
            setIsOpen(false);
            setEditingOkr(null);
          }}
          onSuccess={() => {
            fetchOkrs();
            setIsOpen(false);
            setEditingOkr(null);
          }}
        />
      </Modal>
    </>
  );
};
export default Home;
