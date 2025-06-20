import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IDashboardSummary } from "@/src/common/interfaces/IDashboardSummary";

const endpoint = "/dashboard-summary/";
const reportEndpoint = "/dashboard-report/";

const getSummary = (params?: Record<string, any>): Promise<AxiosResponse<IDashboardSummary>> =>
  apiService.get(endpoint, { params })

const getReport = (params?: Record<string, any>): Promise<AxiosResponse<Blob>> =>
  apiService.get(reportEndpoint, { params, responseType: 'blob' });

export const dashboardService = {
  getSummary,
  getReport,
};