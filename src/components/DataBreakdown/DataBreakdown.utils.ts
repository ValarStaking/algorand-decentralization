import { OperatorId, ParticipantType, StakingSolution } from "@/lib/types";
import { formatIfAddress } from "@/utils/formatting";

export const dataColors: string[] = [
  "#0ea5e9",
  "#22c55e",
  "#e052ff",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
];

export type BreakdownMode = "solution" | "operator" | "type" | "owner";
export type BreakdownSelection = {
  mode: BreakdownMode;
  choice: StakingSolution | OperatorId | ParticipantType | string;
};

export const allBreakdownOptions: { value: BreakdownMode; label: string }[] = [
  { value: "solution", label: "Staking Solution" },
  { value: "operator", label: "Operator" },
  { value: "type", label: "Account Type" },
  { value: "owner", label: "Owner" },
];

export const getCurrentSubtitle = (breakdown: BreakdownSelection[]): string => {
  if (breakdown.length === 0) return "Click on any segment for more details";

  let txt = "";
  breakdown.forEach((b, idx) => {
    if (idx != 0) txt += " - ";
    switch (b.mode) {
      case "solution":
        txt += "Solution: " + b.choice + " staking";
        break;
      case "operator":
        txt += "Operator: " + formatIfAddress(b.choice);
        break;
      case "type":
        txt += "Type: " + b.choice;
        break;
      case "owner":
        txt += "Owner: " + formatIfAddress(b.choice);
        break;
      default:
        break;
    }
  });

  return txt;
};
