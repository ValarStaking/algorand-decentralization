export interface NodelyValarPerfData {
  beneficiary: string;
  beneficiary_nfd: string | null;
  val_owner: string;
  val_nfd: string | null;
  val_ad_app_id: string;
  svc_app_id: string;
  algos: number;
  rspan: string;
  rounds: string;
  avgfp: number;
  votes: string;
  expSoftVotes: number;
  perf: number;
  fOnline: number;
  lastSVRnd: string;
}

export interface NodelyValarPerf {
  data: NodelyValarPerfData[];
}

export interface NodelyNodesCount {
  nodes: string;
  as_of_timestamp: number;
}

export interface NodelyParticipationOnline {
  online: number;
  online_above30k: number;
  eligible: number;
  stake_micro_algo: string;
  eligible_stake_micro_algo: string;
  max_stake: string;
  p50_stake: string;
  p25_stake: string;
  p10_stake: string;
  as_of_round: string;
}

export interface NodelyOnlineAccountData {
  addr: string;
  expSoftVotes: number;
  lastSVRnd: number;
  onlineFraction: number;
  perfPct: number;
  stakeFraction: number;
  votes: number;
}

export interface NodelyOnlineAccountsPerf {
  data: NodelyOnlineAccountData[];
}

export interface NodelyRetiPoolsData {
  balance: number;
  commissionAddr: string;
  eligible: false;
  feesPct: number;
  gatingAssets: number;
  gatingType: string;
  lastpayout: number;
  lastpayoututc: string;
  maxAlgoPerPool: number;
  mbr: number;
  mgrAddr: string;
  minentry: number;
  nodeVer: string;
  online: false;
  ownerAddr: string;
  pollAppAddr: string;
  poolAppId: number;
  poolId: number;
  poolnfd: string;
  poolstakers: number;
  rewardToken: string;
  roundsPerEpoch: number;
  staked: number;
  sunsettingOn: string;
  sunsettingTo: number;
  tokensPerPayout: number;
  validatorId: number;
  validatorNfd: string;
}

export interface NodelyRetiPools {
  data: NodelyRetiPoolsData[];
}
