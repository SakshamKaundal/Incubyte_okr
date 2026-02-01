import type { OkrTypes } from "@/types/OKR_Types.ts";

type OKRProps = {
  okrs: OkrTypes[];
};

const OkrsDisplay = ({ okrs }: OKRProps) => {
  return (
    <div className="p-4 space-y-4">
      {okrs.map((okr) => (
        <div key={okr.id} className="border rounded-xl p-4 shadow-sm bg-white">
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
