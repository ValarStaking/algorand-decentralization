import { allBreakdownOptions, BreakdownMode, BreakdownSelection } from "./DataBreakdown.utils";

interface SelectBreakdownProps {
  breakdown: BreakdownSelection[];
  selectedBreakdown: BreakdownMode;
  setSelectedBreakdown: (value: BreakdownMode) => void;
}

function SelectBreakdown({ breakdown, selectedBreakdown, setSelectedBreakdown }: SelectBreakdownProps) {
  const availableOptions = allBreakdownOptions.filter((opt) => !breakdown.map((b) => b.mode).includes(opt.value));

  return (
    <div className="flex items-center space-x-1 rounded-xl bg-neutral-100 px-4 py-1">
      <span className="text-sm font-medium text-neutral-700">Break down by:</span>
      <select
        value={selectedBreakdown}
        onChange={(e) => setSelectedBreakdown(e.target.value as BreakdownMode)}
        className="w-[144px] rounded-lg border-0 bg-white px-2 py-1 text-sm font-medium text-neutral-700 focus:ring-2 focus:ring-primary-500"
      >
        {availableOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectBreakdown;
