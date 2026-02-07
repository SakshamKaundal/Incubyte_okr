import OKRForm from "@/OKRForm.tsx";
import Modal from "@/components/Modal.tsx";
import { useEffect, useState } from "react";
import OkrsDisplay from "@/components/OkrsDisplay.tsx";

//please fix this after TODO
type ork = {
  id: number;
  title: string;
};

const Home = () => {
  const [okrList, setOkrList] = useState([]);

  const fetchOkrs = async () => {
    fetch("http://localhost:3002/objectives", {
      method: "GET",
      headers: {
        Authorization: "HEllo",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const res = data.map((item: ork) => {
          return {
            id: item.id,
            Objectives: item.title,
            keyValues: [],
          };
        });
        setOkrList(res);
      });
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
