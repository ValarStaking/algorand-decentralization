import { ENTRIES_PER_PAGE_TABLE, MICRO_TO_ALGO } from "@/constants/general";
import { ParticipantInfo } from "@/lib/types";
import { filterByNonSmartContract } from "@/utils/filter";
import { ellipseAddress, formatNumber } from "@/utils/formatting";
import { ColumnDef } from "@tanstack/react-table";
import { CircleEllipsis } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable } from "../Table/DataTable";
import PositionDetailsModal from "./PositionDetailsModal";

type Row = {
  address: string;
  totalAlgo: number;
  type: string;
  owner: string;
  positionsCount: number;
  participant: ParticipantInfo;
};

export default function AccountsTable({
  participants,
  subtitle,
  isLoading = false,
}: {
  participants: Map<string, ParticipantInfo>;
  subtitle?: string;
  isLoading?: boolean;
}) {
  const [selected, setSelected] = useState<null | { address: string; participant: ParticipantInfo }>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    address: true,
    totalAlgo: true,
    type: true,
    owner: true,
    positionsCount: true,
    details: true,
  });

  const data = useMemo<Row[]>(() => {
    const out: Row[] = [];
    const filtered = filterByNonSmartContract(participants);
    for (const [address, participant] of filtered.entries()) {
      out.push({
        address,
        totalAlgo: participant.algo,
        type: participant.addressType,
        owner: participant.owner,
        positionsCount: participant.positions.length,
        participant,
      });
    }
    return out.sort((a, b) => b.totalAlgo - a.totalAlgo);
  }, [participants]);

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        accessorKey: "address",
        header: "Account",
        cell: ({ row }) => (
          <div>
            {row.original.owner !== row.original.address && (
              <div className="mb-1 text-xs font-medium text-valar-gray-700">{row.original.owner}</div>
            )}
            <div className="font-mono text-sm text-valar-gray-600">{ellipseAddress(row.original.address)}</div>
          </div>
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
          <div className="text-valar-blue-600 font-medium">
            {formatNumber(row.original.totalAlgo / MICRO_TO_ALGO) + " ALGO"}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-valar-gray-100 px-2.5 py-0.5 text-xs font-medium text-valar-gray-800">
            {row.original.type}
          </span>
        ),
      },
      {
        accessorKey: "positionsCount",
        header: "Positions",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-center font-medium text-valar-gray-700">{row.original.positionsCount}</div>
        ),
      },
      {
        id: "details",
        header: "Details",
        cell: ({ row }) => (
          <button
            onClick={() => setSelected({ address: row.original.address, participant: row.original.participant })}
            className="bg-valar-blue-50 text-valar-blue-600 hover:bg-valar-blue-100 inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          >
            <CircleEllipsis className="mr-1 h-4 w-4" /> View
          </button>
        ),
      },
    ],
    [],
  );

  const columnLabels = {
    address: "Account",
    totalAlgo: "Stake",
    type: "Type",
    owner: "Owner",
    positionsCount: "Positions",
    details: "Details",
  } as const;

  return (
    <>
      <DataTable<Row, keyof typeof columnLabels & string>
        title="Accounts"
        subtitle={subtitle}
        data={data}
        isLoading={isLoading}
        columns={columns}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        columnLabels={columnLabels}
        disabledColumns={["address", "details"]}
        pageSize={ENTRIES_PER_PAGE_TABLE}
        placeholder="Search by owner address or name"
        filterFn={(r, s) => {
          const sv = s.toLowerCase();
          return r.address.toLowerCase().includes(sv) || r.owner.toLowerCase().includes(sv);
        }}
      />
      {selected && (
        <PositionDetailsModal
          address={selected.address}
          participant={selected.participant}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
