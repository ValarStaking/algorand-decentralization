import { getNodelyStatsApiConfig } from "@/utils/config/getNodelyStatsApiConfig";
import Axios from "axios";

export const nodelyStatsAxios = Axios.create({
  baseURL: getNodelyStatsApiConfig(),
});
