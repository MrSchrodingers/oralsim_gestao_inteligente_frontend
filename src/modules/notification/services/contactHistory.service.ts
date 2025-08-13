import type { AxiosResponse } from "axios";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";
import type { IContactHistory } from "../interfaces/IContactHistory";
import apiService from "@/src/common/services/api.service";

const endpoint = "/contact-history";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IContactHistory>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IContactHistory>> =>
  apiService.get(`${endpoint}/${id}/`);

export const contactHistoryService = {
  getAll,
  getById,
};
