import { LEGEND_DEFAULT_ENTRIES, MICRO_TO_ALGO } from "@/constants/general";
import { DisplayData, JointStats, JointStatsKeys, ParticipantInfo, Position } from "@/lib/types";
import {
  getJointStatsPerOperator,
  getJointStatsPerOwner,
  getJointStatsPerParticipantType,
  getJointStatsPerStakingSolution,
} from "@/utils/calc";
import { formatNumber } from "@/utils/formatting";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  allBreakdownOptions,
  BreakdownMode,
  BreakdownSelection,
  dataColors,
} from "../DataBreakdown/DataBreakdown.utils";
import SelectBreakdown from "../DataBreakdown/SelectBreakdown";
import SettingsSignificant, { FilterMode } from "../DataBreakdown/SettingsSignificant";
import ToggleDisplayData from "../DataBreakdown/ToggleDisplayData";
import LoadingThinSpinner from "../Loaders/LoadingThinSpinner";
import { BarPlot } from "./BarPlot";
import { Legend } from "./Legend";
import { LegendSkeleton } from "./LegendSkeleton";
import { PieChart } from "./PieChart";

interface DataDistributionCardProps {
  participants: Map<string, ParticipantInfo>;
  isLoading?: boolean;
  breakdown: BreakdownSelection[];
  setBreakdown: (value: React.SetStateAction<BreakdownSelection[]>) => void;
  selectedBreakdown: BreakdownMode;
  setSelectedBreakdown: (value: React.SetStateAction<BreakdownMode>) => void;
  subtitle: string;
}

export const DataDistributionCard: React.FC<DataDistributionCardProps> = ({
  participants,
  isLoading = false,
  breakdown,
  setBreakdown,
  selectedBreakdown,
  setSelectedBreakdown,
  subtitle,
}) => {
  const [filterMode, setFilterMode] = useState<FilterMode>("percentage");
  const [minPercentage, setMinPercentage] = useState<number>(1);
  const [maxEntries, setMaxEntries] = useState<number>(LEGEND_DEFAULT_ENTRIES);
  const [displayDataType, setDisplayDataType] = useState<JointStatsKeys>("algo");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  /**
   * --------------------------------
   *     Data Selection Functions
   * --------------------------------
   */
  const getDataTotals = (): Map<string, JointStats> => {
    let totals = new Map<string, JointStats>();

    // Build a positionFilter from breakdown selections
    const positionFilter = (pos: Position, participant: ParticipantInfo) => {
      return breakdown.every((b) => {
        switch (b.mode) {
          case "solution":
            return pos.stakingSolution === b.choice;
          case "operator":
            return pos.operatorId === b.choice;
          case "type":
            return participant.addressType === b.choice;
          case "owner":
            return participant.owner === b.choice;
          default:
            return true;
        }
      });
    };

    // Define totals and colors
    switch (selectedBreakdown) {
      case "solution":
        totals = getJointStatsPerStakingSolution(participants, positionFilter);
        break;
      case "operator":
        totals = getJointStatsPerOperator(participants, positionFilter);
        break;
      case "type":
        totals = getJointStatsPerParticipantType(participants, positionFilter);
        break;
      case "owner":
        totals = getJointStatsPerOwner(participants, positionFilter);
        break;
      default:
        console.error("Unexpected breakdown selection.");
    }

    return totals;
  };

  const getDisplayData = (data: Map<string, JointStats>, statKey: JointStatsKeys): DisplayData[] => {
    const entries = Array.from(data.entries()).sort(([, a], [, b]) => b[statKey] - a[statKey]);
    const totalValue = Array.from(data.values()).reduce((sum, val) => sum + val[statKey], 0);

    let filteredEntries: Array<[string, number]> = [];
    let othersTotal = 0;

    if (filterMode === "percentage") {
      entries.forEach(([key, value]) => {
        const val = value[statKey];
        const percentage = (val / totalValue) * 100;
        if (percentage >= minPercentage) {
          filteredEntries.push([key, val]);
        } else {
          othersTotal += val;
        }
      });
    } else {
      // Count mode
      const entriesToShow = Math.min(maxEntries, entries.length);
      filteredEntries = entries.slice(0, entriesToShow).map(([key, value]) => [key, value[statKey]]);
      othersTotal = entries.slice(entriesToShow).reduce((sum, [, value]) => sum + value[statKey], 0);
    }

    const shouldConvert = statKey !== "accounts";

    const result = filteredEntries.map(([key, val], index) => ({
      label: key,
      value: shouldConvert ? val / MICRO_TO_ALGO : val,
      percentage: (val / totalValue) * 100,
      color: dataColors[index % dataColors.length],
    }));

    if (othersTotal > 0) {
      result.push({
        label: "Others",
        value: shouldConvert ? othersTotal / MICRO_TO_ALGO : othersTotal,
        percentage: (othersTotal / totalValue) * 100,
        color: "#94a3b8",
      });
    }

    return result;
  };

  /**
   * --------------------------------
   *       Variable Shorthands
   * --------------------------------
   */
  const totals = getDataTotals();
  const totalsSize = totals.size;
  const data = getDisplayData(totals, displayDataType);
  const dataTotal = data.reduce((sum, v) => sum + v.value, 0);
  const canDrillDown = breakdown.length < 3;
  const canGoBack = breakdown.length > 0;

  useEffect(() => {
    setMaxEntries((prev) => Math.min(Math.max(prev, LEGEND_DEFAULT_ENTRIES), totalsSize));
  }, [totalsSize]);

  /**
   * --------------------------------
   *        On-Click Handlers
   * --------------------------------
   */
  const handleSegmentClick = (index: number) => {
    const selectedItem = data[index];
    if (selectedItem.label === "Others") return;
    setBreakdown((prev) => {
      const newBreakdown = [...prev, { mode: selectedBreakdown, choice: selectedItem.label }];
      const availableOptions = allBreakdownOptions.filter(
        (opt) => !newBreakdown.map((b) => b.mode).includes(opt.value),
      );

      if (!availableOptions.some((opt) => opt.value === selectedBreakdown)) {
        if (availableOptions.length > 0) {
          setSelectedBreakdown(availableOptions[0].value);
        }
      }

      return newBreakdown;
    });
  };

  const handleBack = () => {
    if (breakdown.length > 0) {
      const lastBreakdown = breakdown[breakdown.length - 1];
      setBreakdown(breakdown.slice(0, -1));
      setSelectedBreakdown(lastBreakdown.mode);
    }
  };

  /**
   * --------------------------------
   *      Component Definition
   * --------------------------------
   */
  return (
    <div className="inline-flex w-full flex-col rounded-3xl border border-neutral-100 bg-white p-8 shadow-soft transition-all duration-300 hover:shadow-medium">
      {/* Title */}
      <div className="mb-6">
        {/* 2-col on >=sm: [title | controls]; 1-col on mobile */}
        <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
          {/* Title: never shrink */}
          <h3 className="text-2xl font-bold text-neutral-900 sm:text-3xl">Distribution</h3>

          {/* Controls on the right (>=sm) */}
          <div className="hidden items-center justify-end gap-2 sm:flex sm:gap-3">
            {canGoBack && (
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 whitespace-nowrap rounded-xl bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:scale-[1.02] hover:bg-neutral-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}
            {/* keep select from wrapping too early on wide screens */}
            <div className="min-w-[240px]">
              <SelectBreakdown
                breakdown={breakdown}
                selectedBreakdown={selectedBreakdown}
                setSelectedBreakdown={setSelectedBreakdown}
              />
            </div>
          </div>
          {/* Subtitle always spans a full row below the toolbar */}
          <p className="text-sm text-neutral-600 sm:col-span-2">{subtitle}</p>
          {/* Controls under the title on small screens; stretch full width */}
          <div className="grid grid-cols-1 gap-2 sm:hidden">
            {canGoBack && (
              <button
                onClick={handleBack}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 transition-all hover:scale-[1.02] hover:bg-neutral-200"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}
            <div className="w-full">
              <SelectBreakdown
                breakdown={breakdown}
                selectedBreakdown={selectedBreakdown}
                setSelectedBreakdown={setSelectedBreakdown}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Display Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleDisplayData displayDataType={displayDataType} setDisplayDataType={setDisplayDataType} />
        <SettingsSignificant
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          minPercentage={minPercentage}
          setMinPercentage={setMinPercentage}
          maxEntries={maxEntries}
          setMaxEntries={setMaxEntries}
          totalEntries={totalsSize}
          displayDataType={displayDataType}
        />
      </div>

      {/* Main content */}
      <div className="flex w-full max-w-full flex-wrap justify-center gap-6 rounded-2xl border border-valar-gray-200 p-2">
        {/* Chart area */}
        {isLoading ? (
          <>
            <LoadingThinSpinner className="flex h-[360px] w-[360px] items-center justify-center text-gray-800" />
            <LegendSkeleton />
          </>
        ) : (
          <>
            <div className="w-full min-w-0 max-w-[360px]" key={displayDataType}>
              {displayDataType === "algo" ? (
                <PieChart
                  data={data}
                  size={360}
                  centerText={formatNumber(dataTotal)}
                  centerSubtext="Online ALGO"
                  hoveredIndex={hoveredIndex}
                  onHover={setHoveredIndex}
                  onSegmentClick={canDrillDown ? handleSegmentClick : undefined}
                />
              ) : (
                <BarPlot
                  data={data}
                  size={360}
                  hoveredIndex={hoveredIndex}
                  onHover={setHoveredIndex}
                  onSegmentClick={canDrillDown ? handleSegmentClick : undefined}
                />
              )}
            </div>

            {/* Legend */}
            <div className="flex-grow basis-full sm:flex-grow-0 sm:basis-auto">
              <Legend
                data={data}
                hoveredIndex={hoveredIndex}
                onHover={setHoveredIndex}
                onSegmentClick={canDrillDown ? handleSegmentClick : undefined}
                displayDataType={displayDataType}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
