import type { OkrTypes } from "@/types/OKR_Types.ts";
import { Trash2,Hammer } from "lucide-react";

export type OKRProps = {
  okrs: OkrTypes[];
  onSuccess: () => void;
  onEdit: (okr: OkrTypes) => void;
};

const OkrsDisplay = ({ okrs, onSuccess,onEdit }: OKRProps) => {
  if (!okrs || !Array.isArray(okrs)) {
    return <div className="p-4">No OKRs to display</div>;
  }
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();//look up TODO
    e.stopPropagation();//look up 
    const url = `http://localhost:3000/objectives/${id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to delete:", response.status, errorData);
        alert(`Failed to delete OKR: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting OKR:", error);
      alert("Error deleting OKR. Please check the console for details.");
    }
  };

  return (
    <div className="p-4 space-y-4 ">
      {okrs.map((okr) => (
        <div
          key={okr.id}
          className="relative border rounded-xl p-4 shadow-sm bg-white"
        >
          
          <button
            type="button"
            className="absolute top-3 right-11 z-10 text-blue-400 hover:text-blue-700 transition-colors cursor-pointer"
            onClick={() => onEdit(okr)}
            aria-label="EditOKR"
          >
            <Hammer />
          </button>
          
          
          <button
            type="button"
            className="absolute top-3 right-3 z-10 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            onClick={(e) => handleDelete(e, okr.id)}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Delete OKR"
          >
            <Trash2 />
          </button>

          <h2 className="font-bold text-lg mb-2">{okr.title}</h2>

          <div className="space-y-2">
            {okr.keyResults?.map((kr, index) => (
              <label
                key={index}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input type="checkbox" className="accent-blue-500" />
                <span>
                  {kr.description}
                  <span className="text-gray-400 ml-2">({kr.progress}%)</span>
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
