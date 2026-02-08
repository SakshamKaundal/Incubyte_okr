import OKRForm from "@/OKRForm.tsx";
import Modal from "@/components/Modal.tsx";
import { useEffect, useState } from "react";
import OkrsDisplay from "@/components/OkrsDisplay.tsx";
import type { KeyResult, OkrTypes } from "@/types/OKR_Types.ts";

//please fix this after TODO
// type ork = {
//   id: number;
//   title: string;
// };

const Home = () => {
  const [okrList, setOkrList] = useState([]);
  const fetchOkrs = async () => {
    const res = await fetch("http://localhost:3000/objectives");
    const data = await res.json();
    console.log(data)
    const mapped = data.map((item: OkrTypes) => ({
      id: item.id,
      title: item.title,
      keyResults: item.keyResults?.map((kr: KeyResult) => ({
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

  const [isOpen, setIsOpen] = useState(false);

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

      <OkrsDisplay okrs={okrList} onSuccess={fetchOkrs} />
      <Modal isOpen={isOpen}>
        <OKRForm
          onClose={() => {
            setIsOpen(false);
          }}
          onSuccess={fetchOkrs}
        />
      </Modal>
    </>
  );
};
export default Home;
