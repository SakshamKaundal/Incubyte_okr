import type { OkrTypes } from "@/types/OKR_Types.ts";
import { Trash2 } from "lucide-react";

type OKRProps = {
  okrs: OkrTypes[];
  onSuccess: () => void;
};

const OkrsDisplay = ({ okrs, onSuccess }: OKRProps) => {
  const handleDelete = (id: number) => {
    fetch(`http://localhost:3002/objectives/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          onSuccess();
          console.log("Resource deleted successfully");
        } else {
          console.error("Failed to delete");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="p-4 space-y-4 ">
      {okrs.map((okr) => (
        <div
          key={okr.id}
          className="relative border rounded-xl p-4 shadow-sm bg-white"
        >
          <button
            className="absolute top-3 right-3 text-red-500"
            onClick={() => handleDelete(okr.id)}
          >
            <Trash2 />
          </button>

          <h2 className="font-bold text-lg mb-2">{okr.Objectives}</h2>

          <div className="space-y-2">
            {okr.keyValues.map((kr, index) => (
              <label
                key={index}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input type="checkbox" className="accent-blue-500" />
                <span>
                  {kr.Values}
                  <span className="text-gray-400 ml-2">({kr.progress})</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default OkrsDisplay;
