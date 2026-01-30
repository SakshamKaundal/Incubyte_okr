import type {OkrTypes} from "@/types/OKR_Types";

type Props = {
    okrs: OkrTypes[];
};

function OkrList({okrs}: Props) {
    console.log(okrs);
    return (
        <>
            {okrs.map((okr, index) => (
                <div key={index} className="mb-4 border p-3 rounded">
                    <h2 className="font-bold">{okr.objective}</h2>

                    {okr.keyResults.map((kr, index) => (
                        <div key={index} className={"flex-col"}>
                            <label >
                                <input type="checkbox" className="mr-2"/>
                                {kr.description} {kr.progress}%
                            </label>
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
}

export default OkrList;
