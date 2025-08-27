import {
  isSmartContractType,
  JointStats,
  OperatorId,
  ParticipantInfo,
  ParticipantType,
  Position,
  StakingSolution,
} from "@/lib/types";

export function calcCoefficient(algos: number[], algoThreshold: number): number {
  let total = 0;
  for (let i = 0; i < algos.length; i++) {
    total += algos[i];
    if (total >= algoThreshold) {
      return i + 1;
    }
  }

  return algos.length;
}

type PositionPredicate = (pos: Position, participant: ParticipantInfo) => boolean;

export function getJointStatsPerOperator(
  participants: Map<string, ParticipantInfo>,
  positionFilter?: PositionPredicate,
): Map<OperatorId, JointStats> {
  const totals = new Map<OperatorId, JointStats>();

  for (const participant of participants.values()) {
    if (isSmartContractType(participant.addressType)) continue;

    const seenOperators = new Set<OperatorId>();

    for (const pos of participant.positions) {
      if (positionFilter && !positionFilter(pos, participant)) continue;

      const current = totals.get(pos.operatorId) ?? { algo: 0, accounts: 0 };
      totals.set(pos.operatorId, {
        algo: current.algo + pos.algo,
        accounts: current.accounts + (seenOperators.has(pos.operatorId) ? 0 : 1),
      });

      seenOperators.add(pos.operatorId);
    }
  }

  return totals;
}

export function getJointStatsPerStakingSolution(
  participants: Map<string, ParticipantInfo>,
  positionFilter?: PositionPredicate,
): Map<StakingSolution, JointStats> {
  const totals = new Map<StakingSolution, JointStats>();

  for (const participant of participants.values()) {
    if (isSmartContractType(participant.addressType)) continue;

    const seenSolutions = new Set<StakingSolution>();

    for (const pos of participant.positions) {
      if (positionFilter && !positionFilter(pos, participant)) continue;

      const current = totals.get(pos.stakingSolution) ?? { algo: 0, accounts: 0 };
      totals.set(pos.stakingSolution, {
        algo: current.algo + pos.algo,
        accounts: current.accounts + (seenSolutions.has(pos.stakingSolution) ? 0 : 1),
      });

      seenSolutions.add(pos.stakingSolution);
    }
  }

  return totals;
}

export function getJointStatsPerParticipantType(
  participants: Map<string, ParticipantInfo>,
  positionFilter?: PositionPredicate,
): Map<ParticipantType, JointStats> {
  const totals = new Map<ParticipantType, JointStats>();

  for (const participant of participants.values()) {
    if (isSmartContractType(participant.addressType)) continue;

    let totalAlgo = 0;
    for (const pos of participant.positions) {
      if (positionFilter && !positionFilter(pos, participant)) continue;
      totalAlgo += pos.algo;
    }
    if (totalAlgo === 0) continue; // skip participants with no valid positions

    const participantType = participant.addressType as ParticipantType;
    const current = totals.get(participantType) ?? { algo: 0, accounts: 0 };

    totals.set(participantType, {
      algo: current.algo + totalAlgo,
      accounts: current.accounts + 1,
    });
  }

  return totals;
}

export function getJointStatsPerOwner(
  participants: Map<string, ParticipantInfo>,
  positionFilter?: PositionPredicate,
): Map<string, JointStats> {
  const totals = new Map<string, JointStats>();

  for (const participant of participants.values()) {
    if (isSmartContractType(participant.addressType)) continue;

    let totalAlgo = 0;
    for (const pos of participant.positions) {
      if (positionFilter && !positionFilter(pos, participant)) continue;
      totalAlgo += pos.algo;
    }
    if (totalAlgo === 0) continue; // skip participants with no valid positions

    const owner = participant.owner;
    const current = totals.get(owner) ?? { algo: 0, accounts: 0 };

    totals.set(owner, {
      algo: current.algo + totalAlgo,
      accounts: current.accounts + 1,
    });
  }

  return totals;
}
