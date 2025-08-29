import { getAlgorandFoundationStatsApiConfig } from "@/utils/config/getAlgorandFoundationStatsApiConfig";
import { getNodelyStatsApiConfig } from "@/utils/config/getNodelyStatsApiConfig";
import Axios from "axios";

export const nodelyStatsAxios = Axios.create({
  baseURL: getNodelyStatsApiConfig(),
});

export const algorandFoundationStatsAxios = Axios.create({
  baseURL: getAlgorandFoundationStatsApiConfig(),
});
