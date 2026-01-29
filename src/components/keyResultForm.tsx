import type {keyValues} from "../types/OKR_Types.ts";
import {useContext, useState} from "react";
import  {KeyResultContext} from "../contexts/KeyResultProvider.tsx";


const KeyResultForm = () => {

    const [keyResult, setKeyResult] = useState<keyValues>({
        Values: '',
        progress : ''
    });

    const {setKeyResultList} = useContext(KeyResultContext)

    return (

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Key Result</label>

                <input
                    required={true}
                    placeholder="Enter the key result"
                    className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    value={keyResult.Values}
                    onChange={(e) => setKeyResult({...keyResult,Values:e.target.value})}
                />
                <label className="text-sm font-medium">Progress</label>
                <input
                    required={true}
                    type="number"
                    placeholder="Enter the key result"
                    className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    value={keyResult.progress}
                    onChange={(e) => setKeyResult({...keyResult,progress:e.target.value})}
                />

                <button
                    className={'border rounded-md px-3 py-1 bg-blue-500 text-white'}
                    type="button"
                    onClick={() => {
                        setKeyResultList((keyResultList: keyValues[]) => [
                            ...keyResultList,
                            keyResult,
                        ]);
                    }}
                >
                    Add
                </button>
            </div>

    )
}
export default KeyResultForm
