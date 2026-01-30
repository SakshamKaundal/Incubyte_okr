import Modal from "@/components/Modal";
import OKRForm from "@/OKRForm";
import OkrList from "@/components/OkrList";
import type {OkrTypes} from "@/types/OKR_Types";
import {useEffect, useState} from "react";

function Home() {
    // const dummyOkrs: OkrTypes[] = [
    //     {
    //         objective: "Become better at frontend",
    //         keyResults: [
    //             {description: "Learn TypeScript", progress: '80'},
    //             {description: "Learn React Hooks", progress: "80"},
    //         ],
    //     },
    //     {
    //         objective: "DSA practice",
    //         keyResults: [
    //             {description: "Solve 100 problems", progress: "80"},
    //         ],
    //     },
    // ];

    const [okrData, setOkrData] = useState<OkrTypes[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/okrs").then((res) => res.json()).then((data) => setOkrData(data));
    }, [])

    return (
        <>
            <OkrList okrs={okrData}/>

            <Modal buttonName="ADD OKR">
                <OKRForm/>
            </Modal>
        </>
    );
}

export default Home;
