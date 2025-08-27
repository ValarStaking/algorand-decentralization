import { useStakingStats } from "@/api/stats/stats.query";
import { useAppStore } from "@/store/appStore";
import { useEffect } from "react";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //AppStore
  const algorandClient = useAppStore((s) => s.algorandClient);

  const stakingStatsQuery = useStakingStats(algorandClient, {
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
