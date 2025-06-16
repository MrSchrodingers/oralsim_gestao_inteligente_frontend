import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IDashboardSummary } from "@/src/common/interfaces/IDashboardSummary";

const endpoint = "/dashboard";

const getSummary = (): Promise<AxiosResponse<IDashboardSummary>> =>
  apiService.get(`dashboard-summary/`);

export const dashboardService = {
  getSummary,
};
