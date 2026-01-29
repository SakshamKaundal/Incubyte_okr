import type {keyValues} from "../types/OKR_Types.ts";
import {useContext, useState} from "react";
import  {KeyResultContext} from "../contexts/KeyResultProvider.tsx";


const KeyResultForm = () => {
    const [keyResult, setKeyResult] = useState<keyValues>({ Values: '', progress: '' });
    const [error, setError] = useState('');
    const { setKeyResultList } = useContext(KeyResultContext);

    const handleAdd = () => {
        if (!keyResult.Values.trim()) {
            setError('Key result is required');
            return;
        }
        const n = Number(keyResult.progress);
        if (keyResult.progress === '' || n < 0 || n > 100) {
            setError('Progress must be 0–100');
            return;
        }
        setError('');
        setKeyResultList((list: keyValues[]) => [...list, keyResult]);
        setKeyResult({ Values: '', progress: '' });
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Key Result</label>
            <input
                placeholder="Enter the key result"
                className={`border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : ''}`}
                value={keyResult.Values}
                onChange={(e) => {
                    setKeyResult((prev) => ({ ...prev, Values: e.target.value }));
                    setError('');
                }}
            />
            <label className="text-sm font-medium">Progress</label>
            <input
                type="number"
                min={0}
                max={100}
                placeholder="0–100"
                className={`border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : ''}`}
                value={keyResult.progress}
                onChange={(e) => {
                    setKeyResult((prev) => ({ ...prev, progress: e.target.value }));
                    setError('');
                }}
            />
            {error && <span className="text-sm text-red-500">{error}</span>}
            <button type="button" className="border rounded-md px-3 py-1 bg-blue-500 text-white" onClick={handleAdd}>
                Add
            </button>
        </div>
    );
};
export default KeyResultForm
