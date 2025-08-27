import { MICRO_TO_ALGO } from "@/constants/general";
import { ParticipantInfo } from "@/lib/types";
import { formatIfAddress, formatNumber, formatPercentage } from "@/utils/formatting";
import { X } from "lucide-react";
import { useEffect } from "react";

import { Overlay } from "../Overlay";

interface PositionDetailsModalProps {
  address: string;
  participant: ParticipantInfo;
  onClose: () => void;
}

const PositionDetailsModal: React.FC<PositionDetailsModalProps> = ({ address, participant, onClose }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const infoItems = [
    {
      label: "Owner",
      value: participant.owner !== address ? participant.owner : "Unknown",
    },
    {
      label: "Account Type",
      value: participant.addressType,
    },
    {
      label: "Total Stake",
      value: formatNumber(participant.algo / MICRO_TO_ALGO) + " ALGO",
      valueClass: "font-bold text-valar-blue-600",
    },
  ];

  const InfoItem = ({
    label,
    value,
    valueClass = "",
  }: {
    label: string;
    value: React.ReactNode;
    valueClass?: string;
  }) => (
    <div className="flex w-fit flex-col">
      <p className="text-sm font-normal text-valar-gray-600">{label}</p>
      <p className={`text-lg font-medium text-valar-gray-900 ${valueClass}`}>{value}</p>
    </div>
  );

  return (
    <Overlay>
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-valar-gray-200 bg-white shadow-strong">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-valar-gray-200 p-6">
          <div>
            <h3 className="text-xl font-bold text-valar-gray-900">Account Details</h3>
            <p className="mt-1 break-all font-mono text-sm text-valar-gray-600">{address}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-valar-gray-400 hover:bg-valar-gray-100 hover:text-valar-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-2">
          {/* Participant Info */}
          <div className="grid grid-cols-3 gap-4 border-b p-4">
            {infoItems.map((item, idx) => (
              <InfoItem key={idx} {...item} />
            ))}
          </div>

          {/* Positions */}
          <div className="p-4">
            <h4 className="mb-4 text-lg font-semibold text-valar-gray-900">
              Positions ({participant.positions.length})
            </h4>
            <div className="max-h-32 space-y-3 overflow-y-auto md:max-h-64">
              {participant.positions.map((position, index) => (
                <div key={index} className="rounded-2xl border border-valar-gray-200 bg-white p-4 hover:shadow-soft">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-valar-gray-900">
                        Staking Solution: {position.stakingSolution}
                      </p>
                      <p className="text-sm font-medium text-valar-gray-900">
                        Operator:{" "}
                        {position.operatorId === address ? "Self-operating" : formatIfAddress(position.operatorId)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-valar-blue-600 text-lg font-semibold">
                        {formatNumber(position.algo / MICRO_TO_ALGO) + " ALGO"}
                      </p>
                      <p className="text-xs text-valar-gray-500">
                        {formatPercentage(position.algo / participant.algo)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
};

export default PositionDetailsModal;
