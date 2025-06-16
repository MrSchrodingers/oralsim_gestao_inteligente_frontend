import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IPatientPhone, IPatientPhoneCreateDTO, IPatientPhoneUpdateDTO } from "@/src/common/interfaces/IPatientPhone";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/patient-phones";

const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IPatientPhone>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IPatientPhone>> =>
  apiService.get(`${endpoint}/${id}/`);

const create = (data: IPatientPhoneCreateDTO): Promise<AxiosResponse<IPatientPhone>> =>
  apiService.post(endpoint, data);

const update = (id: string, data: IPatientPhoneUpdateDTO): Promise<AxiosResponse<IPatientPhone>> =>
  apiService.put(`${endpoint}/${id}/`, data);

const remove = (id: string): Promise<AxiosResponse<void>> =>
  apiService.delete(`${endpoint}/${id}/`);

export const patientPhoneService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
