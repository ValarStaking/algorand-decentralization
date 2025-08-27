import { ALGO_MIN, ASA_ID_tALGO, ASA_ID_xALGO, MICRO_TO_ALGO } from "@/constants/general";
import { NodelyNodesCount, NodelyParticipationOnline, NodelyRetiPoolsData, NodelyValarPerf } from "@/interfaces/nodely";
import { nodelyStatsAxios } from "@/lib/axios";
import { AddressType, KnownAccount, LSTsType, OperatorId, ParticipantInfo } from "@/lib/types";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import Bottleneck from "bottleneck";
import Papa from "papaparse";

import { fetchStakedInfoForPool, fetchValidatorConfig } from "../reti/contracts";

export type StatsContext = {
  algorandClient: AlgorandClient;
  stakeOnline: number;
  participants: Map<string, ParticipantInfo>;
  knownAccounts: Map<string, KnownAccount>;
};

const props = {
  headers: { Accept: "*/*" },
};

function defaultParticipantInfo(addr: string): ParticipantInfo {
  const participant: ParticipantInfo = {
    addressType: "Unknown",
    owner: addr,
    confidence: 0,
    algo: 0,
    positions: [],
  };

  return participant;
}

function processKnownAccounts(
  addr: string,
  participant: ParticipantInfo,
  knownAccounts: Map<string, KnownAccount>,
): OperatorId {
  let operatorId = addr;
  const knownAccount = knownAccounts.get(addr);
  if (knownAccount) {
    participant.addressType = knownAccount.addressType ? knownAccount.addressType : "Unknown";
    participant.owner = knownAccount.owner ? knownAccount.owner : participant.owner;
    participant.confidence = knownAccount.confidence;
    operatorId = knownAccount.operator ? knownAccount.operator : addr;
  }

  return operatorId;
}

export async function loadKnownAccounts(): Promise<Map<string, KnownAccount>> {
  const response = await fetch("/data/known_accounts.csv");
  const text = await response.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  const map = new Map<string, KnownAccount>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const row of parsed.data as any[]) {
    const address = row["Address"]?.trim();
    if (!address) continue;

    const owner = row["Owner"]?.trim() ?? "";
    const addressType = (row["Type"]?.trim() ?? "") as AddressType;
    const confidence = Number(row["Confidence"]) || 0;
    const operator = row["Operator"]?.trim() ?? "";

    const knownAccount: KnownAccount = {
      addressType,
      owner,
      confidence,
      operator,
    };

    map.set(address, knownAccount);
  }

  return map;
}

export async function getNodeCount(): Promise<number> {
  const {
    data: { nodes: nodesTotalRaw },
  } = await nodelyStatsAxios.get<NodelyNodesCount>(`/v1/delayed/network/nodes/count`, props);
  return Number(nodesTotalRaw);
}

export async function getOnlineInfo(): Promise<{
  accountsOnlineAll: number;
  stakeOnline: number;
}> {
  const { data: participation } = await nodelyStatsAxios.get<NodelyParticipationOnline>(
    `/v1/realtime/participation/online`,
    props,
  );
  const { online: accountsOnlineAll, stake_micro_algo: stakeOnlineString } = participation;
  const stakeOnline = Number(stakeOnlineString);

  return {
    accountsOnlineAll,
    stakeOnline,
  };
}

export async function getOnlineAccounts(ctx: StatsContext) {
  const { algorandClient, participants, knownAccounts } = ctx;

  const accountsInfo = await algorandClient.client.indexer
    .searchAccounts()
    .onlineOnly(true)
    .exclude("all")
    .includeAll(false)
    .do();
  const accounts = accountsInfo.accounts;
  let nextToken = accountsInfo.nextToken;
  let nextTokenPrevious = undefined;
  while (nextToken != nextTokenPrevious) {
    if (!nextToken) break;
    const accountsInfo = await algorandClient.client.indexer
      .searchAccounts()
      .onlineOnly(true)
      .exclude("all")
      .includeAll(false)
      .nextToken(nextToken)
      .do();
    accounts.push(...accountsInfo.accounts);
    nextTokenPrevious = nextToken;
    nextToken = accountsInfo.nextToken;
  }

  // Add them to participants
  accounts.forEach((account) => {
    const addr = account.address;
    const algo = Number(account.amount);

    const participant = defaultParticipantInfo(addr);
    let operatorId = processKnownAccounts(addr, participant, knownAccounts);
    operatorId = operatorId === addr && participant.owner !== addr ? participant.owner : operatorId;
    participant.algo = algo;
    participant.positions.push({ stakingSolution: "Native", operatorId, algo });

    participants.set(addr, participant);
  });
}

export async function processLST(ctx: StatsContext, stakingSolution: LSTsType) {
  const { algorandClient, participants, knownAccounts } = ctx;

  // Note: Does account for 3rd-level ownership, i.e. owner of LP tokens with the LST.
  // LP pools are treated as own accounts.
  let asaId = 0;
  switch (stakingSolution) {
    case "Folks Finance":
      asaId = ASA_ID_xALGO;
      break;
    case "Tinyman":
      asaId = ASA_ID_tALGO;
      break;
    default:
      console.error("Unexpected LST ", stakingSolution);
      return;
  }

  // Get all operators and their occurrences (i.e. weights)
  const operatorIds = new Map<OperatorId, number>();
  participants.forEach((p) => {
    if (p.addressType !== stakingSolution) return;
    p.positions.forEach((pos) => {
      const operator = pos.operatorId;
      const counter = operatorIds.get(operator) ?? 0;
      operatorIds.set(operator, counter + 1);
    });
  });
  const operatorsNum = Array.from(operatorIds.values()).reduce((sum, v) => sum + v, 0);

  const algoUnderControl = Array.from(participants.values())
    .filter((p) => p.addressType === stakingSolution)
    .reduce((sum, p) => sum + p.algo, 0);
  const asaInfo = await algorandClient.client.algod.getAssetByID(asaId).do();

  const asaHolders = await algorandClient.client.indexer.lookupAssetBalances(asaId).do();

  const balances = asaHolders.balances;
  let nextToken = asaHolders.nextToken;
  let nextTokenPrevious = undefined;
  while (nextToken != nextTokenPrevious) {
    if (!nextToken) break;
    const asaHolders = await algorandClient.client.indexer.lookupAssetBalances(asaId).nextToken(nextToken).do();
    balances.push(...asaHolders.balances);
    nextTokenPrevious = nextToken;
    nextToken = asaHolders.nextToken;
  }

  const reserveAddress = asaInfo.params.reserve;
  const reserveBalance = balances.find((balance) => balance.address == reserveAddress)?.amount ?? 0n;
  const asaToAlgo = algoUnderControl / Number(asaInfo.params.total - reserveBalance);

  balances.forEach((balance) => {
    const addr = balance.address;
    if (addr == reserveAddress) return;

    const asaBalance = Number(balance.amount);
    if (asaBalance < ALGO_MIN) return; // Skip accounts with less than min balance

    const algo = Math.round(asaBalance * asaToAlgo);

    const participant = participants.get(addr) ?? defaultParticipantInfo(addr);
    processKnownAccounts(addr, participant, knownAccounts);
    participant.algo += algo;

    operatorIds.forEach((operatorOccurrence, operator) => {
      const operatorAlgo = Math.floor((algo / operatorsNum) * operatorOccurrence);
      participant.positions.push({ stakingSolution, operatorId: operator, algo: operatorAlgo });
    });

    participants.set(addr, participant);
  });
}

export async function processValar(ctx: StatsContext) {
  const { participants, knownAccounts } = ctx;
  // Get Valar info
  const { data: valarPerf } = await nodelyStatsAxios.get<NodelyValarPerf>(`/v1/delayed/valar/votingperformance/24hr`, {
    ...props,
    params: { format: "JSON" },
  });
  // Process accounts on Valar
  valarPerf.data.forEach((account) => {
    const addr = account.beneficiary;
    const algo = Math.round(account.algos * MICRO_TO_ALGO);
    const validatorOwner = account.val_owner;

    const participant = participants.get(addr) ?? defaultParticipantInfo(addr);
    processKnownAccounts(addr, participant, knownAccounts);
    // Remove "Native" because it is not, but rather Valar
    const positions = participant.positions.filter((pos) => pos.stakingSolution !== "Native");
    if (!participants.get(addr)) {
      participant.algo += algo;
    } else {
      // Skip changing total algo because it has been accounted already in Native
    }
    const operatorId = knownAccounts.get(validatorOwner)?.owner ?? validatorOwner;
    positions.push({ stakingSolution: "Valar", operatorId, algo });
    participant.positions = positions;

    participants.set(addr, participant);
  });
}

const bottleneckOptions: Bottleneck.ConstructorOptions = {
  maxConcurrent: Number(import.meta.env.VITE_RATE_MAX_CONCURRENT ?? 8),
  minTime: Number(import.meta.env.VITE_RATE_MIN_TIME ?? 1000 / 50),
};

export async function processReti(ctx: StatsContext) {
  const { algorandClient, participants, knownAccounts } = ctx;

  // Get Reti info
  const limiter = new Bottleneck(bottleneckOptions);
  const { data: retiPools } = await nodelyStatsAxios.get<NodelyRetiPoolsData[]>(`/v1/realtime/reti/pools`, {
    ...props,
    params: { format: "JSON" },
  });
  // Process pools on reti
  await Promise.all(
    retiPools.map(async (pool) => {
      let poolOwnerAddr = pool.ownerAddr;
      const stakers = await limiter.schedule(() => fetchStakedInfoForPool(algorandClient, BigInt(pool.poolAppId)));

      if (!poolOwnerAddr) {
        // For some reason, Nodely doesn't provide owner in all cases (just for validator 1)
        // TO DO: Speak with Urtho
        // console.log("Pool owner missing from Nodely (validator ID, pool ID): ", pool.validatorId, pool.poolId);
        // Fetch it from blockchain
        const validatorConfig = await limiter.schedule(() => fetchValidatorConfig(algorandClient, pool.validatorId));
        poolOwnerAddr = validatorConfig.owner;
      }
      const operatorId = knownAccounts.get(poolOwnerAddr)?.owner ?? poolOwnerAddr;

      // Process pool address
      const poolAddress = pool.pollAppAddr;
      const participantPool = participants.get(poolAddress);
      if (participantPool) {
        participantPool.addressType = "Reti";
        participantPool.confidence = 3;
        if (participantPool.positions.length != 1) console.error("Unexpected Position at Reti pool: ", poolAddress);
        const position = participantPool.positions[0];
        participantPool.positions = [
          {
            stakingSolution: "Native",
            operatorId: operatorId,
            algo: position.algo,
          },
        ];
        participants.set(poolAddress, participantPool);
      } else {
        // If pool is not in participants list, it is either too small or offline, so skip
        return;
      }

      stakers.forEach((staker) => {
        const algo = Number(staker.balance);
        const addr = staker.account;
        if (algo < ALGO_MIN) return; // Skip accounts with less than min balance

        const participant = participants.get(addr) ?? defaultParticipantInfo(addr);
        processKnownAccounts(addr, participant, knownAccounts);
        participant.algo += algo;
        participant.positions.push({ stakingSolution: "Reti", operatorId, algo });

        participants.set(addr, participant);
      });
    }),
  );
}

export function serializeParticipants(participants: Map<string, ParticipantInfo>): string {
  const obj = Object.fromEntries(participants);
  return JSON.stringify(obj, null, 2);
}
