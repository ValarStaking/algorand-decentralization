import { MICRO_TO_ALGO, NAKAMOTO_COEFFICIENT_LIMIT, NETWORK_HALT_LIMIT, UPGRADE_LIMIT } from "@/constants/general";
import { useAppStore } from "@/store/appStore";
import { calcCoefficient, getJointStatsPerOperator } from "@/utils/calc";
import { filterByNonSmartContract } from "@/utils/filter";
import { formatNumber, formatPercentage } from "@/utils/formatting";
import { isValidAddress } from "algosdk";
import { Activity, ArrowUpCircle, Globe, Shield, UserCog, Users } from "lucide-react";

import { Skeleton } from "./Loaders/Skeleton";
import { Tooltip } from "./Tooltip";

function NetworkOverview() {
  const stakingStatsQuery = useAppStore((s) => s.stakingStatsQuery);
  const stats = stakingStatsQuery?.data;
  const isLoading = !stakingStatsQuery || stakingStatsQuery?.isLoading;

  const participantsNonSmartContract = filterByNonSmartContract(stats?.participants ?? new Map());

  const operators = getJointStatsPerOperator(participantsNonSmartContract);
  const operatorsNum = operators.size;
  const operatorsNumKnown = Array.from(operators.keys())
    .map((operatorId) => !isValidAddress(operatorId))
    .reduce((sum, val) => sum + Number(val), 0);
  const operatorsAlgosArray = Array.from(operators.values())
    .map((stat) => stat.algo)
    .sort((a, b) => b - a);

  // const stakeOnline = stats?.stakeOnline ?? 0;  // TO DO: Clarify potential difference
  const stakeOnline = operatorsAlgosArray.reduce((sum, v) => sum + v, 0);
  const stakeRate = stakeOnline / (stats?.supplyCirculating ?? 1);

  const selfOperatingNum = Array.from(participantsNonSmartContract.entries())
    .map(([addr, p]) => p.positions.some((pos) => pos.operatorId === addr))
    .reduce((sum, val) => sum + Number(val), 0);

  const nakamotoCoefficient = calcCoefficient(operatorsAlgosArray, stakeOnline * NAKAMOTO_COEFFICIENT_LIMIT);
  const haltCoefficient = calcCoefficient(operatorsAlgosArray, stakeOnline * NETWORK_HALT_LIMIT);
  const upgradeCoefficient = calcCoefficient(operatorsAlgosArray, stakeOnline * UPGRADE_LIMIT);

  const cards = [
    {
      title: "Online Stake",
      value: formatNumber(stakeOnline / MICRO_TO_ALGO) + " ALGO",
      icon: Shield,
      color: "success",
      progress: stakeRate * 100,
      subtitle: `${formatPercentage(stakeRate)} of circulating supply`,
      description: "Amount of ALGO that is securing the Algorand network.",
    },
    {
      title: "Node Operators",
      value: operatorsNum,
      icon: UserCog,
      color: "primary",
      progress: (operatorsNumKnown / operatorsNum) * 100,
      subtitle: `${formatPercentage(operatorsNumKnown / operatorsNum)} known operators`,
      description: "Number of known node operators and anonymous online accounts.",
    },
    {
      title: "Accounts Staking",
      value: participantsNonSmartContract.size,
      icon: Users,
      color: "primary",
      progress: (selfOperatingNum / participantsNonSmartContract.size) * 100,
      subtitle: `${selfOperatingNum} staking by themselves`,
      description: "Number of accounts that are (in)directly staking.",
    },
    {
      title: "Liveliness Coefficient",
      value: haltCoefficient.toString(),
      icon: Activity,
      color: "warning",
      subtitle: "Entities to control 20%",
      description: `Algorand network halts if more than 20% of online stake is unresponsive. Currently, ${haltCoefficient.toString() + " entit" + (haltCoefficient > 1 ? "ies together" : "y alone")} can halt the chain.`,
    },
    {
      title: "Nakamoto Coefficient",
      value: nakamotoCoefficient.toString(),
      icon: Globe,
      color: "accent",
      subtitle: "Entities to control 33%",
      description: `Algorand network is secure as long as more than 2/3 of online stake is operated by honest participants. Currently, ${nakamotoCoefficient.toString() + " entit" + (nakamotoCoefficient > 1 ? "ies together" : "y alone")} can attack the chain.`,
    },
    {
      title: "Upgrade Coefficient",
      value: upgradeCoefficient.toString(),
      icon: ArrowUpCircle,
      color: "warning",
      subtitle: "Entities to control 90%",
      description: `Algorand protocol can be upgraded if more than 90% of online stake agrees. Currently, ${upgradeCoefficient.toString() + " entit" + (upgradeCoefficient > 1 ? "ies" : "y")} are enough to agree to upgrade the chain.`,
    },
  ];

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1">
      {cards.map((card) => {
        const colorClasses = {
          bg: "bg-primary-50",
          icon: "text-primary-600",
          iconBg: "bg-primary-100",
          progress: "bg-primary-500",
        };
        const Icon = card.icon;

        return (
          <Tooltip key={card.title} content={card.description}>
            <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-neutral-100 bg-white p-6 shadow-soft transition-all duration-300 hover:border-neutral-200 hover:shadow-medium">
              <div className="mb-1 flex items-start justify-between">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-neutral-600">{card.title}</p>
                  {isLoading ? (
                    <>
                      <Skeleton className="mb-2 h-9 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </>
                  ) : (
                    <>
                      <p className="mb-1 text-3xl font-bold text-neutral-900">{card.value}</p>
                      {card.subtitle && <p className="text-sm text-neutral-500">{card.subtitle}</p>}
                    </>
                  )}
                </div>
                <div
                  className={`rounded-2xl p-3 ${colorClasses.iconBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className={`h-6 w-6 ${colorClasses.icon}`} strokeWidth={2.5} />
                </div>
              </div>
              {"progress" in card && (
                <div className="mt-1">
                  <div className="h-2 w-full rounded-full bg-neutral-200">
                    {isLoading ? (
                      <Skeleton className="h-2 w-full rounded-full" />
                    ) : (
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ease-out ${colorClasses.progress}`}
                        style={{ width: `${card.progress}%` }}
                      ></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default NetworkOverview;
