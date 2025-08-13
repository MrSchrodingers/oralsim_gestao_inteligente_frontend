import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";
import type { IPendingClinic } from "@/src/common/interfaces/IPendingClinic";

const endpoint = "/registration-requests";

const getAll = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>,
): Promise<AxiosResponse<IPagedResponse<IPendingClinic>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IPendingClinic>> =>
  apiService.get(`${endpoint}/${id}/`);

const approve = (id: string): Promise<AxiosResponse<{ message: string }>> =>
  apiService.post(`${endpoint}/${id}/approve`);

const reject = (id: string): Promise<AxiosResponse<{ message: string }>> =>
  apiService.post(`${endpoint}/${id}/reject`);

export const registrationRequestService = {
  getAll,
  getById,
  approve,
  reject,
};