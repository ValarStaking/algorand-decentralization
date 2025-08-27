import { isValidAddress } from "algosdk";

export const formatNumber = (num: number, decimals: number = 1): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}k`;
  if (num % 1 != 0) return num.toFixed(decimals);
  return num.toString();
};

export const formatPercentage = (num: number, decimals: number = 1): string => `${(num * 100).toFixed(decimals)}%`;

export function ellipseAddress(address = ``, width = 6): string {
  return address ? `${address.slice(0, width)}...${address.slice(-width)}` : address;
}

export function formatIfAddress(txt: string): string {
  if (isValidAddress(txt)) {
    return ellipseAddress(txt);
  } else {
    return txt;
  }
}
