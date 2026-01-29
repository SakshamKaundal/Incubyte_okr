import { useContext } from "react";
import { KeyResultContext } from "../contexts/KeyResultProvider.tsx";

const KeyResultList = () => {
  const { keyResultList } = useContext(KeyResultContext);

  if (!Array.isArray(keyResultList) || keyResultList.length === 0) return null;

  return (
    <ul className="mt-3 space-y-2">
      {keyResultList.map((keyResult, index) => (
        <li
          key={index}
          className="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
        >
          {keyResult.Values} — <span className="font-medium">{keyResult.progress}%</span>
        </li>
      ))}
    </ul>
  );
};

export default KeyResultList;
