import { StakingStats } from "@/lib/types";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { StatsApi } from "./stats.api";

export function useStakingStats(
  algorandClient: AlgorandClient,
  options?: Omit<UseQueryOptions<StakingStats | undefined>, "queryKey" | "queryFn">,
) {
  return useQuery({
    ...options,
    queryKey: ["Staking_Stats"],
    queryFn: () => StatsApi.fetchStakingStats(algorandClient),
    enabled: !!algorandClient && options?.enabled,
  });
}
