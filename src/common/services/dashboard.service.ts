import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IDashboardSummary } from "@/src/common/interfaces/IDashboardSummary";

const endpoint = "/dashboard-summary/";

const getSummary = (): Promise<AxiosResponse<IDashboardSummary>> =>
  apiService.get(endpoint);

export const dashboardService = {
  getSummary,
};