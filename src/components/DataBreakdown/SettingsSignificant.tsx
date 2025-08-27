import { LEGEND_MAX, LEGEND_MAX_ENTRIES, LEGEND_MIN, LEGEND_STEP } from "@/constants/general";
import { JointStats } from "@/lib/types";
import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type FilterMode = "percentage" | "count";

interface SettingsSignificantProps {
  filterMode: FilterMode;
  setFilterMode: (mode: FilterMode) => void;
  minPercentage: number;
  setMinPercentage: (value: number) => void;
  maxEntries: number;
  setMaxEntries: (value: number) => void;
  totalEntries: number;
  displayDataType: keyof JointStats;
}

function SettingsSignificant({
  filterMode,
  setFilterMode,
  minPercentage,
  setMinPercentage,
  maxEntries,
  setMaxEntries,
  totalEntries,
  displayDataType,
}: SettingsSignificantProps) {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxMaxEntries = Math.min(totalEntries, LEGEND_MAX_ENTRIES);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }

    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowSettings(false);
      }
    }

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showSettings]);

  useEffect(() => {
    if (displayDataType === "accounts") {
      setFilterMode("count");
    }
  }, [setFilterMode, displayDataType]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center space-x-2 rounded-xl bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-200"
      >
        <Settings className="h-4 w-4" />
        <span>Filter</span>
      </button>

      {showSettings && (
        <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-xl border border-neutral-200 bg-white p-4 shadow-medium">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700">Filter</label>
              {displayDataType === "algo" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterMode("percentage")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      filterMode === "percentage"
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    By Percentage
                  </button>
                  <button
                    onClick={() => setFilterMode("count")}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      filterMode === "count"
                        ? "bg-primary-500 text-white"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    By Count
                  </button>
                </div>
              )}
            </div>

            {filterMode === "percentage" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Minimum percentage: {minPercentage}%
                </label>
                <input
                  type="range"
                  min={LEGEND_MIN}
                  max={LEGEND_MAX}
                  step={LEGEND_STEP}
                  value={minPercentage}
                  onChange={(e) => setMinPercentage(parseFloat(e.target.value))}
                  className="w-full accent-primary-500"
                />
                <div className="mt-1 flex justify-between text-xs text-neutral-500">
                  <span>0.1%</span>
                  <span>10%</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Maximum entries: {maxEntries}</label>
                <input
                  type="range"
                  min={1}
                  max={maxMaxEntries}
                  step={1}
                  value={maxEntries}
                  onChange={(e) => setMaxEntries(parseInt(e.target.value))}
                  className="w-full accent-primary-500"
                />
                <div className="mt-1 flex justify-between text-xs text-neutral-500">
                  <span>1</span>
                  <span>{maxMaxEntries}</span>
                </div>
              </div>
            )}

            <div className="border-t border-neutral-200 pt-2">
              <p className="text-xs text-neutral-500">
                {filterMode === "percentage"
                  ? "Show entries above minimum percentage."
                  : "Show specified number of largest entries."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsSignificant;
