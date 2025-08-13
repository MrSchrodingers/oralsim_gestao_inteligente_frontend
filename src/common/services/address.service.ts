import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IAddress, IAddressCreateDTO, IAddressUpdateDTO } from "@/src/common/interfaces/IAddress";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/addresses";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IAddress>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IAddress>> =>
  apiService.get(`${endpoint}/${id}/`);

const create = (data: IAddressCreateDTO): Promise<AxiosResponse<IAddress>> =>
  apiService.post(endpoint, data);

const update = (id: string, data: IAddressUpdateDTO): Promise<AxiosResponse<IAddress>> =>
  apiService.put(`${endpoint}/${id}/`, data);

const remove = (id: string): Promise<AxiosResponse<void>> =>
  apiService.delete(`${endpoint}/${id}/`);

export const addressService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
