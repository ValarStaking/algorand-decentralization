import { useStakingStats } from "@/api/stats/stats.query";
import { parseStakingStats } from "@/api/stats/stats.utils";
import { useAppStore } from "@/store/appStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //AppStore
  const algorandClient = useAppStore((s) => s.algorandClient);
  const qc = useQueryClient();

  // Preload data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/data/snapshot.json", { cache: "no-store" });
        if (!res.ok) return;
        const raw = await res.json();
        const snapshot = parseStakingStats(raw)

        if (!cancelled) {
          qc.setQueryData(["Staking_Stats"], snapshot, { updatedAt: snapshot.timestamp });
        }
      } catch {
        console.error("Could not preload data.")
      }
    })();
    return () => { cancelled = true; };
  }, [qc]);

  const stakingStatsQuery = useStakingStats(algorandClient, {
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  /**
   * =======================================
   *            Staking Stats
   * =======================================
   */

  useEffect(() => {
    useAppStore.setState({
      stakingStatsQuery: stakingStatsQuery,
    });
  }, [stakingStatsQuery]);

  /**
   * =======================================
   *            Component Renders
   * =======================================
   */

  return <div>{children}</div>;
};
