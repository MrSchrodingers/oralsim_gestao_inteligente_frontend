import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IInstallment } from "@/src/common/interfaces/IInstallment";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/installments";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IInstallment>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IInstallment>> =>
  apiService.get(`${endpoint}/${id}/`);

export const installmentService = {
  getAll,
  getById,
};
