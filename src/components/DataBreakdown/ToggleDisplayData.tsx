import { JointStatsKeys } from "@/lib/types";

interface ToggleDisplayDataProps {
  displayDataType: JointStatsKeys;
  setDisplayDataType: (value: JointStatsKeys) => void;
}

function ToggleDisplayData({ displayDataType, setDisplayDataType }: ToggleDisplayDataProps) {
  return (
    <>
      {/* Toggle `Show data by` */}
      <div className="flex items-center space-x-2 rounded-xl bg-neutral-100 px-4 py-2">
        <span className="text-sm font-medium text-neutral-700">Show data by:</span>
        <div className="flex overflow-hidden rounded-lg border border-neutral-200">
          <button
            onClick={() => setDisplayDataType("algo")}
            className={`px-3 py-1 text-sm font-medium transition-all duration-200 ${
              displayDataType === "algo"
                ? "bg-primary-500 text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            Stake
          </button>
          <button
            onClick={() => setDisplayDataType("accounts")}
            className={`px-3 py-1 text-sm font-medium transition-all duration-200 ${
              displayDataType === "accounts"
                ? "bg-primary-500 text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            Accounts
          </button>
        </div>
      </div>
    </>
  );
}

export default ToggleDisplayData;
