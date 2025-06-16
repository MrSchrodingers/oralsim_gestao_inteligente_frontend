import type { AxiosResponse } from "axios";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";
import apiService from "@/src/common/services/api.service";
import type { ICollectionCase } from "../interfaces/ICollectionCase";

const endpoint = "/collection-case";

const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<ICollectionCase>>> =>
    apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<ICollectionCase>> =>
    apiService.get(`${endpoint}/${id}/`);

export const collectionCaseService = {
    getAll,
    getById,
};
