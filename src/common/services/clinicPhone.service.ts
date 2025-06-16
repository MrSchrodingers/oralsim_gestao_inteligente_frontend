import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IClinicPhone, IClinicPhoneCreateDTO, IClinicPhoneUpdateDTO } from "@/src/common/interfaces/IClinicPhone";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/clinic-phones";

const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IClinicPhone>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IClinicPhone>> =>
  apiService.get(`${endpoint}/${id}/`);

const create = (data: IClinicPhoneCreateDTO): Promise<AxiosResponse<IClinicPhone>> =>
  apiService.post(endpoint, data);

const update = (id: string, data: IClinicPhoneUpdateDTO): Promise<AxiosResponse<IClinicPhone>> =>
  apiService.put(`${endpoint}/${id}/`, data);

const remove = (id: string): Promise<AxiosResponse<void>> =>
  apiService.delete(`${endpoint}/${id}/`);

export const clinicPhoneService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
