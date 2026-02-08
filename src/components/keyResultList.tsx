import { useContext, useState } from "react";
import { KeyResultContext } from "../contexts/KeyResultProvider.tsx";
import { Trash2, Edit, Check, X } from "lucide-react";

const KeyResultList = ({ isEditMode = false }: { isEditMode?: boolean }) => {
  const { keyResultList, setKeyResultList } = useContext(KeyResultContext);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editProgress, setEditProgress] = useState("");

  if (!Array.isArray(keyResultList) || keyResultList.length === 0) return null;

  const handleDelete = (index: number, keyResult: any) => {
    
    const newKeyResultList = keyResultList.filter((_, i) => i !== index);
    setKeyResultList(newKeyResultList);
    
    if (isEditMode && keyResult.id) {
      fetch(`http://localhost:3000/keyresults/${keyResult.id}`, {
        method: "DELETE"
      }).catch(err => console.error("Failed to delete key result:", err));
    }
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditDescription(keyResultList[index].description);
    setEditProgress(keyResultList[index].progress.toString());
  };

  const saveEdit = (index: number) => {
    const updatedList = [...keyResultList];
    updatedList[index] = {
      ...updatedList[index],
      description: editDescription,
      progress: parseInt(editProgress) || 0
    };
    setKeyResultList(updatedList);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditDescription("");
    setEditProgress("");
  };

  return (
    <ul className="mt-3 space-y-2">
      {keyResultList.map((keyResult, index) => (
        <li
          key={index}
          className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
        >
          {editingIndex === index ? (
            // Edit mode
            <>
              <input
                type="text"
                value={editDescription}
                onChange={(e) => {
                  e.stopPropagation();
                  setEditDescription(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 px-2 py-1 border rounded text-sm"
                autoFocus
              />
              <input
                type="number"
                value={editProgress}
                onChange={(e) => {
                  e.stopPropagation();
                  setEditProgress(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                min="0"
                max="100"
                className="w-16 px-2 py-1 border rounded text-sm"
              />
              <button
                type="button"
                className="text-green-500 hover:text-green-700 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  saveEdit(index);
                }}
                aria-label="Save edit"
              >
                <Check size={16} />
              </button>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  cancelEdit();
                }}
                aria-label="Cancel edit"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            // View mode
            <>
              <span className="flex-1">{keyResult.description}</span>
              <span className="font-medium">{keyResult.progress}%</span>

              {/* Edit button */}
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  startEdit(index);
                }}
                aria-label="Edit key result"
              >
                <Edit size={14} />
              </button>

              {/* Delete button */}
              <button
                type="button"
                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(index, keyResult);
                }}
                aria-label="Delete key result" 
              >
                <Trash2 size={16}/>
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default KeyResultList;
