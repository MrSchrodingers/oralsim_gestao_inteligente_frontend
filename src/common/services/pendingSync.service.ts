import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IPendingSync } from "@/src/common/interfaces/IPendingSync";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/pending-syncs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IPendingSync>>> =>
  apiService.get(endpoint, { params });

const approve = (id: string): Promise<AxiosResponse<IPendingSync>> =>
    apiService.post(`${endpoint}/${id}/approve/`);

export const pendingSyncService = {
  getAll,
  approve,
};
