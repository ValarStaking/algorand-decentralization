export function getAlgorandFoundationStatsApiConfig() {
  if (import.meta.env.VITE_ENVIRONMENT === "local") {
    return "/af";
  }

  return import.meta.env.VITE_ALGORAND_FOUNDATION_STATS ?? "";
}
