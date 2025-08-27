import { FEE_SINK, RETI_APP_ID } from "@/constants/general";
import { StakingPoolClient } from "@/contracts/reti/StakingPoolClient";
import { ValidatorRegistryClient } from "@/contracts/reti/ValidatorRegistryClient";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";

export async function getSimulateStakingPoolClient(
  algorandClient: AlgorandClient,
  poolAppId: bigint,
  senderAddr: string = FEE_SINK,
): Promise<StakingPoolClient> {
  return algorandClient.client.getTypedAppClientById(StakingPoolClient, {
    defaultSender: senderAddr,
    appId: poolAppId,
  });
}

export async function getSimulateValidatorClient(
  algorandClient: AlgorandClient,
  senderAddr: string = FEE_SINK,
): Promise<ValidatorRegistryClient> {
  return algorandClient.client.getTypedAppClientById(ValidatorRegistryClient, {
    defaultSender: senderAddr,
    appId: BigInt(RETI_APP_ID),
  });
}
