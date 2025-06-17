import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IDashboardSummary } from "@/src/common/interfaces/IDashboardSummary";

const endpoint = "/dashboard-summary/";

const getSummary = (params?: Record<string, any>): Promise<AxiosResponse<IDashboardSummary>> =>
  apiService.get(endpoint, { params })

export const dashboardService = {
  getSummary,
};