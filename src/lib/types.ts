export type KnownAccount = {
  addressType: AddressType;
  owner: string;
  confidence: number;
  operator: OperatorId;
};

// Confidence
// 0 = no info
// 1 = speculation
// 2 = strong evidence
// 3 = confirmed by owner

export type StakingStats = {
  nodesTotal: number;
  accountsOnlineAll: number;
  stakeOnline: number;
  supplyCirculating: number;
  supplyTotal: number;
  participants: Map<string, ParticipantInfo>;
  timestamp: number;
};

export type ParticipantInfo = {
  addressType: AddressType;
  owner: string;
  confidence: number;
  algo: number; // total held
  positions: Position[]; // unified list of holdings
};

export type Position = {
  stakingSolution: StakingSolution; // e.g., "Native", "Valar", "Folks Finance"
  operatorId: OperatorId; // can be address or owner name
  algo: number; // amount for this specific solution & operator
};

export type OperatorId = string; // Operator ID = either address or owner name

export type ParticipantType = "Unknown" | "CEX" | "VC" | "Company" | "Individual" | "Escrow";
export type LSTsType = "Folks Finance" | "Tinyman";
export type PoolsType = "Reti";
export type SmartContractsType = LSTsType | PoolsType;
export type AddressType = ParticipantType | SmartContractsType;

export type StakingSolution = "Native" | "Valar" | SmartContractsType;

export const LSTs: LSTsType[] = ["Folks Finance", "Tinyman"];
export const Pools: PoolsType[] = ["Reti"];
export const SmartContracts: SmartContractsType[] = [...LSTs, ...Pools];

export function isSmartContractType(value: unknown): boolean {
  return typeof value === "string" && SmartContracts.includes(value as SmartContractsType);
}

export function isParticipantType(value: unknown, participantType: ParticipantType): boolean {
  return value === participantType;
}

export type JointStats = {
  algo: number;
  accounts: number;
};

export type JointStatsKeys = keyof JointStats;

export type DisplayData = {
  label: string;
  value: number;
  percentage: number;
  color: string;
};

export type RawParticipants =
  | Record<string, ParticipantInfo>
  | Array<[string, ParticipantInfo]>;
