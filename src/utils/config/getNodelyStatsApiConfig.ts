export function getNodelyStatsApiConfig() {
  if (import.meta.env.VITE_ENVIRONMENT === "local") {
    return "/api";
  }

  return import.meta.env.VITE_NODELY_STATS ?? "";
}
