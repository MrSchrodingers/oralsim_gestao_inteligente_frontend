import apiService from "@/src/common/services/api.service";
import type { AxiosResponse } from "axios";
import type { IFlowStepConfig } from "../interfaces/IFlowStepConfig";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/flow-step-config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IFlowStepConfig>>> =>
    apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IFlowStepConfig>> =>
    apiService.get(`${endpoint}/${id}/`);

export const flowStepConfigService = {
    getAll,
    getById,
};
