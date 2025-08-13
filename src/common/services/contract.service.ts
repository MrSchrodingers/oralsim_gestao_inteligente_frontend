import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IContract } from "@/src/common/interfaces/IContract";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/contracts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IContract>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IContract>> =>
  apiService.get(`${endpoint}/${id}/`);

export const contractService = {
  getAll,
  getById,
};
