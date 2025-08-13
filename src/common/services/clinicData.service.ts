import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IClinicData, IClinicDataCreateDTO, IClinicDataUpdateDTO } from "@/src/common/interfaces/IClinicData";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/clinic-data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IClinicData>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IClinicData>> =>
  apiService.get(`${endpoint}/${id}/`);

const create = (data: IClinicDataCreateDTO): Promise<AxiosResponse<IClinicData>> =>
  apiService.post(endpoint, data);

const update = (id: string, data: IClinicDataUpdateDTO): Promise<AxiosResponse<IClinicData>> =>
  apiService.put(`${endpoint}/${id}/`, data);

const remove = (id: string): Promise<AxiosResponse<void>> =>
  apiService.delete(`${endpoint}/${id}/`);

export const clinicDataService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
