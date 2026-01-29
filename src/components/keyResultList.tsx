import {useContext} from "react";
import {KeyResultContext} from "../contexts/KeyResultProvider.tsx";



const KeyResultList = () => {
    const {keyResultList} = useContext(KeyResultContext)
    return (
        <div className="mt-2">
            <ul className="list-disc list-inside">
                {Array.isArray(keyResultList) && keyResultList.map((keyResult, index) => (
                    <li key={index} className="text-gray-700">{keyResult.Values} {keyResult.progress}%</li>
                ))}
            </ul>
    </div>
  )
}

export default KeyResultList