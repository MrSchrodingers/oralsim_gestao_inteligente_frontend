import apiService from "@/src/common/services/api.service";
import type { AxiosResponse } from "axios";
import type { IPendingCall } from "../interfaces/IPendingCall";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/pending-calls";

const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IPendingCall>>> =>
    apiService.get(endpoint, { params });

const update = (id: string, data: Partial<IPendingCall>): Promise<AxiosResponse<IPendingCall>> =>
    apiService.patch(`${endpoint}/${id}/`, data);

export const pendingCallService = {
    getAll,
    update,
};
