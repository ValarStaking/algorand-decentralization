import { ParticipantInfo, StakingStats } from "@/lib/types";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";

import {
  getNodeCount,
  getOnlineAccounts,
  getOnlineInfo,
  loadKnownAccounts,
  processLST,
  processReti,
  processValar,
  serializeParticipants,
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
      // TO DO: Find an API
      const supplyTotal = 10 * 10 ** (9 + 6); // TO DO: Correct for the officially burned ALGO
      const supplyCirculating = 8.692 * 10 ** (9 + 6);

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

      // // Process Tinyman tALGO holders
      await processLST(ctx, "Tinyman");

      // Print participants for debugging
      if (import.meta.env.VITE_ENVIRONMENT === "local") console.log(serializeParticipants(ctx.participants));

      return {
        nodesTotal,
        accountsOnlineAll,
        stakeOnline,
        supplyCirculating,
        supplyTotal,
        participants: ctx.participants,
      };
    } catch (err) {
      console.error("Error fetching staking stats ::", err);
      return undefined;
    }
  }
}
