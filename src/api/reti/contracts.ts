import { StakedInfo, StakedInfoFromTuple } from "@/contracts/reti/StakingPoolClient";
import { ValidatorConfig } from "@/contracts/reti/ValidatorRegistryClient";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import { ALGORAND_ZERO_ADDRESS_STRING } from "algosdk";

import { getSimulateStakingPoolClient, getSimulateValidatorClient } from "./client";

export async function fetchValidatorConfig(
  algorandClient: AlgorandClient,
  validatorId: number | bigint,
): Promise<ValidatorConfig> {
  const validatorClient = await getSimulateValidatorClient(algorandClient);
  const config = await validatorClient.getValidatorConfig({
    args: { validatorId },
  });
  return config;
}

export async function fetchStakedInfoForPool(algorandClient: AlgorandClient, poolAppId: bigint): Promise<StakedInfo[]> {
  try {
    const stakingPoolClient = await getSimulateStakingPoolClient(algorandClient, poolAppId);
    const stakers = await stakingPoolClient.state.box.stakers();
    return stakers!
      .map((s): StakedInfo => StakedInfoFromTuple(s))
      .filter((staker) => staker.account !== ALGORAND_ZERO_ADDRESS_STRING);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
