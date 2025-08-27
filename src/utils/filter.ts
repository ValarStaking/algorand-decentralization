import {
  isParticipantType,
  isSmartContractType,
  OperatorId,
  ParticipantInfo,
  ParticipantType,
  StakingSolution,
} from "@/lib/types";

export function filterByOperator(
  participants: Map<string, ParticipantInfo>,
  operator: OperatorId,
): Map<string, ParticipantInfo> {
  const filtered = new Map<string, ParticipantInfo>();

  for (const [addr, participant] of participants.entries()) {
    // Skip intermediary participants
    if (isSmartContractType(participant.addressType)) continue;

    if (participant.positions.some((pos) => pos.operatorId === operator)) {
      filtered.set(addr, participant);
    }
  }

  return filtered;
}

export function filterByStakingSolution(
  participants: Map<string, ParticipantInfo>,
  stakingSolution: StakingSolution,
): Map<string, ParticipantInfo> {
  const filtered = new Map<string, ParticipantInfo>();

  for (const [addr, participant] of participants.entries()) {
    // Skip intermediary participants
    if (isSmartContractType(participant.addressType)) continue;

    if (participant.positions.some((pos) => pos.stakingSolution === stakingSolution)) {
      filtered.set(addr, participant);
    }
  }

  return filtered;
}

export function filterByParticipantType(
  participants: Map<string, ParticipantInfo>,
  participantType: ParticipantType,
): Map<string, ParticipantInfo> {
  const filtered = new Map<string, ParticipantInfo>();

  for (const [addr, participant] of participants.entries()) {
    if (isParticipantType(participant.addressType, participantType)) {
      filtered.set(addr, participant);
    }
  }

  return filtered;
}

export function filterByOwner(participants: Map<string, ParticipantInfo>, owner: string): Map<string, ParticipantInfo> {
  const filtered = new Map<string, ParticipantInfo>();

  for (const [addr, participant] of participants.entries()) {
    if (participant.owner === owner) {
      filtered.set(addr, participant);
    }
  }

  return filtered;
}

export function filterByNonSmartContract(participants: Map<string, ParticipantInfo>): Map<string, ParticipantInfo> {
  const filtered = new Map<string, ParticipantInfo>();

  for (const [addr, participant] of participants.entries()) {
    // Skip intermediary participants
    if (isSmartContractType(participant.addressType)) continue;

    filtered.set(addr, participant);
  }

  return filtered;
}
