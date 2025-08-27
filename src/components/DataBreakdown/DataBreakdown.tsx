import { OperatorId, ParticipantInfo, ParticipantType, StakingSolution } from "@/lib/types";
import { useAppStore } from "@/store/appStore";
import { filterByOperator, filterByOwner, filterByParticipantType, filterByStakingSolution } from "@/utils/filter";
import { useState } from "react";

import AccountsTable from "../AccountsTable/AccountsTable";
import { DataDistributionCard } from "../DataDistributionCard/DataDistributionCard";
import { BreakdownMode, BreakdownSelection, getCurrentSubtitle } from "./DataBreakdown.utils";

function DataBreakdown() {
  const stakingStatsQuery = useAppStore((s) => s.stakingStatsQuery);
  const isLoading = !stakingStatsQuery || stakingStatsQuery?.isLoading;
  const stats = stakingStatsQuery?.data;

  const [breakdown, setBreakdown] = useState<BreakdownSelection[]>([]);
  const [selectedBreakdown, setSelectedBreakdown] = useState<BreakdownMode>("solution");

  /**
   * --------------------------------
   *     Data Selection Functions
   * --------------------------------
   */
  const getCurrentData = (): Map<string, ParticipantInfo> => {
    if (!stats) return new Map();

    const participants = stats.participants;
    let filtered = participants;

    // Apply participant-level filters
    breakdown.forEach((b) => {
      switch (b.mode) {
        case "solution":
          filtered = filterByStakingSolution(filtered, b.choice as StakingSolution);
          break;
        case "operator":
          filtered = filterByOperator(filtered, b.choice as OperatorId);
          break;
        case "type":
          filtered = filterByParticipantType(filtered, b.choice as ParticipantType);
          break;
        case "owner":
          filtered = filterByOwner(filtered, b.choice);
          break;
        default:
          console.error("Unexpected breakdown path.");
      }
    });

    return filtered;
  };

  /**
   * --------------------------------
   *       Variable Shorthands
   * --------------------------------
   */
  const participants = getCurrentData();
  const subtitle = getCurrentSubtitle(breakdown);
  const subtitleAccountTable =
    breakdown.length == 0 ? "Click on any distribution segment to filter accounts" : subtitle;

  /**
   * --------------------------------
   *      Component Definition
   * --------------------------------
   */
  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-[900px] space-y-6">
        <DataDistributionCard
          participants={participants}
          isLoading={isLoading}
          breakdown={breakdown}
          setBreakdown={setBreakdown}
          selectedBreakdown={selectedBreakdown}
          setSelectedBreakdown={setSelectedBreakdown}
          subtitle={subtitle}
        />

        <AccountsTable participants={participants} subtitle={subtitleAccountTable} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default DataBreakdown;
