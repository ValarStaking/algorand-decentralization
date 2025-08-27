import { StakingStats } from "@/lib/types";
import {
  getAlgodConfigFromViteEnvironment,
  getIndexerConfigFromViteEnvironment,
} from "@/utils/config/getAlgorandClientConfigs";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import { UseQueryResult } from "@tanstack/react-query";
import { create } from "zustand";

// Initialize default clients
const algodConfig = getAlgodConfigFromViteEnvironment();
const indexerConfig = getIndexerConfigFromViteEnvironment();
const defaultAlgorandClient = AlgorandClient.fromConfig({
  algodConfig,
  indexerConfig,
});

interface AppState {
  algorandClient: AlgorandClient;

  // Staking Stats
  stakingStatsQuery: UseQueryResult<StakingStats | undefined, Error> | undefined;
}

export const useAppStore = create<AppState>()(() => ({
  // Initial state
  algorandClient: defaultAlgorandClient,
  stakingStatsQuery: undefined,
}));
