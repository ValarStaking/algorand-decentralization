import { ENTRIES_PER_PAGE_TABLE, MICRO_TO_ALGO } from "@/constants/general";
import { StakingSolution } from "@/lib/types";
import { useAppStore } from "@/store/appStore";
import { filterByNonSmartContract } from "@/utils/filter";
import { formatIfAddress, formatNumber, formatPercentage } from "@/utils/formatting";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable } from "../Table/DataTable";

type OperatorRow = {
  operatorId: string;
  totalAlgo: number;
  percentage: number;
  accountsCount: number;
  hasNative: boolean;
  hasValar: boolean;
  hasReti: boolean;
  hasFolksFinance: boolean;
  hasTinyman: boolean;
};

const StakingSolutionMark: React.FC<{ has: boolean }> = ({ has }) => (
  <div className="flex items-center space-x-1">
    {has ? <Check className="text-valar-success-600 h-4 w-4" /> : <X className="h-4 w-4 text-valar-gray-300" />}
  </div>
);

export default function OperatorsTable() {
  const stakingStatsQuery = useAppStore((s) => s.stakingStatsQuery);
  const participants = stakingStatsQuery?.data?.participants;
  const stakeOnline = stakingStatsQuery?.data?.stakeOnline;

  const [visibleColumns, setVisibleColumns] = useState({
    operatorId: true,
    totalAlgo: true,
    accountsCount: true,
    native: true,
    valar: true,
    reti: true,
    folksFinance: false,
    tinyman: false,
  });

  // Build row data
  const data = useMemo<OperatorRow[]>(() => {
    if (!participants || !stakeOnline) return [];

    const rows: OperatorRow[] = [];
    const stats = new Map<string, { totalAlgo: number; accounts: Set<string>; solutions: Set<StakingSolution> }>();

    const filtered = filterByNonSmartContract(participants);

    for (const [address, participant] of filtered.entries()) {
      for (const pos of participant.positions) {
        if (!stats.has(pos.operatorId)) {
          stats.set(pos.operatorId, {
            totalAlgo: 0,
            accounts: new Set(),
            solutions: new Set(),
          });
        }
        const op = stats.get(pos.operatorId)!;
        op.totalAlgo += pos.algo;
        op.accounts.add(address);
        op.solutions.add(pos.stakingSolution);
      }
    }

    for (const [operatorId, op] of stats.entries()) {
      rows.push({
        operatorId,
        totalAlgo: op.totalAlgo,
        percentage: (op.totalAlgo / stakeOnline) * 100,
        accountsCount: op.accounts.size,
        hasNative: op.solutions.has("Native"),
        hasValar: op.solutions.has("Valar"),
        hasReti: op.solutions.has("Reti"),
        hasFolksFinance: op.solutions.has("Folks Finance"),
        hasTinyman: op.solutions.has("Tinyman"),
      });
    }

    return rows.sort((a, b) => b.totalAlgo - a.totalAlgo);
  }, [participants, stakeOnline]);

  // Column definitions
  const columns = useMemo<ColumnDef<OperatorRow>[]>(
    () => [
      {
        accessorKey: "operatorId",
        header: "Operator ID",
        cell: ({ row }) => (
          <div className="font-mono text-sm text-valar-gray-700">{formatIfAddress(row.original.operatorId)}</div>
        ),
        size: 280,
        minSize: 240,
        maxSize: 320,
      },
      {
        accessorKey: "totalAlgo",
        header: "Stake",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <div className="text-valar-blue-600 font-medium">
              {formatNumber(row.original.totalAlgo / MICRO_TO_ALGO) + " ALGO"}
            </div>
            <div className="text-xs font-normal text-valar-gray-700">
              {formatPercentage(row.original.percentage / 100, 2)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "accountsCount",
        header: "Accounts",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-center font-medium text-valar-gray-700">{row.original.accountsCount}</div>
        ),
      },
      {
        accessorKey: "hasNative",
        id: "native",
        header: "Native",
        enableSorting: true,
        cell: ({ row }) => <StakingSolutionMark has={row.original.hasNative} />,
      },
      {
        accessorKey: "hasValar",
        id: "valar",
        header: "Valar",
        enableSorting: true,
        cell: ({ row }) => <StakingSolutionMark has={row.original.hasValar} />,
      },
      {
        accessorKey: "hasReti",
        id: "reti",
        header: "Reti",
        enableSorting: true,
        cell: ({ row }) => <StakingSolutionMark has={row.original.hasReti} />,
      },
      {
        accessorKey: "hasFolksFinance",
        id: "folksFinance",
        header: "Folks Finance",
        enableSorting: true,
        cell: ({ row }) => <StakingSolutionMark has={row.original.hasFolksFinance} />,
      },
      {
        accessorKey: "hasTinyman",
        id: "tinyman",
        header: "Tinyman",
        enableSorting: true,
        cell: ({ row }) => <StakingSolutionMark has={row.original.hasTinyman} />,
      },
    ],
    [],
  );

  const columnLabels = {
    operatorId: "Operator ID",
    totalAlgo: "Stake",
    accountsCount: "Accounts",
    native: "Native",
    valar: "Valar",
    reti: "Reti",
    folksFinance: "Folks Finance",
    tinyman: "Tinyman",
  } as const;

  return (
    <section id="operators">
      <DataTable<OperatorRow, keyof typeof columnLabels & string>
        title="Operators"
        data={data}
        isLoading={!stakingStatsQuery || stakingStatsQuery.isLoading}
        columns={columns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        columnLabels={columnLabels}
        disabledColumns={["operatorId"]}
        pageSize={ENTRIES_PER_PAGE_TABLE}
        placeholder="Search by operator name or address"
        filterFn={(row, search) => row.operatorId.toLowerCase().includes(search.toLowerCase())}
      />
    </section>
  );
}
