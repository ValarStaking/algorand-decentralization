import { ParticipantInfo, StakingStats } from "@/lib/types";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";

import {
  getCirculatingSupply,
  getNodeCount,
  getOnlineAccounts,
  getOnlineInfo,
  loadKnownAccounts,
  processLST,
  processReti,
  processValar,
  serializeStakingStats,
  StatsContext,
} from "./stats.utils";

export class StatsApi {
  static async fetchStakingStats(algorandClient: AlgorandClient): Promise<StakingStats | undefined> {
    try {
      // Get general network info
      const nodesTotal = await getNodeCount();

      // Get online info
      const { accountsOnlineAll, stakeOnline } = await getOnlineInfo();

      // Get total and circulating supply
      const supplyTotal = 10 * 10 ** (9 + 6); // TO DO: Correct for the officially burned ALGO
      const supplyCirculating = await getCirculatingSupply();

      // Initialize context
      const ctx: StatsContext = {
        algorandClient,
        stakeOnline,
        participants: new Map<string, ParticipantInfo>(),
        knownAccounts: await loadKnownAccounts(),
      };

      // Get largest online accounts
      await getOnlineAccounts(ctx);

      // Process Valar accounts
      await processValar(ctx);

      // Process Reti accounts
      await processReti(ctx);

      // Process Folks Finance xALGO holders
      await processLST(ctx, "Folks Finance");

      // Process Tinyman tALGO holders
      await processLST(ctx, "Tinyman");

      // Create staking stats
      const stakingStats: StakingStats = {
        nodesTotal,
        accountsOnlineAll,
        stakeOnline,
        supplyCirculating,
        supplyTotal,
        participants: ctx.participants,
        timestamp: Date.now(),
      };

      // Print stats for debugging
      if (import.meta.env.VITE_ENVIRONMENT === "local") console.log(serializeStakingStats(stakingStats));

      return stakingStats;
    } catch (err) {
      console.error("Error fetching staking stats ::", err);
      return undefined;
    }
  }
}
