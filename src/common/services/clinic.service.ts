import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";
import type { IClinic, IClinicCreateDTO, IClinicSummary, IClinicUpdateDTO } from "../interfaces/IClinic";

const endpoint = "/clinics";

const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IClinic>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IClinic>> =>
  apiService.get(`${endpoint}/${id}/`);

const getSummary = (id: string): Promise<AxiosResponse<IClinicSummary>> =>
  apiService.get(`${endpoint}/${id}/summary`);

const create = (data: IClinicCreateDTO): Promise<AxiosResponse<IClinic>> =>
  apiService.post(endpoint, data);

const update = (id: string, data: IClinicUpdateDTO): Promise<AxiosResponse<IClinic>> =>
  apiService.put(`${endpoint}/${id}/`, data);

const remove = (id: string): Promise<AxiosResponse<void>> =>
  apiService.delete(`${endpoint}/${id}/`);

export const clinicService = {
  getAll,
  getById,
  create, 
  update,
  remove,
  getSummary
};
