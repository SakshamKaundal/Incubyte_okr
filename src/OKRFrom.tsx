import './App.css'
import {useState} from "react";
import * as React from "react";
import KeyResultList from "./components/keyResultList.tsx";
import KeyResultForm from "./components/keyResultForm.tsx";

function OKRFrom() {
    const [objectiveState, setObjectiveState] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(objectiveState)
    }

    function handleClear() {
        setObjectiveState('')
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md w-96" onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
                <h1>OKR Form</h1>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium">objectives</label>
                    <input
                        placeholder="Insert the objective"
                        className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        value={objectiveState}
                        name={"Values"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {e.target.value = objectiveState}}
                    />
                </div>

                <KeyResultForm/>

                <div className="flex gap-3 mt-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        type={"submit"}>
                        Submit
                    </button>
                    <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={handleClear}>
                        Clear
                    </button>
                </div>
                <KeyResultList/>

            </form>
        </div>
    )
}

export default OKRFrom
