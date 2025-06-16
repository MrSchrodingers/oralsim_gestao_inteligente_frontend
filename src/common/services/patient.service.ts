import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IPatient, IPatientUpdateDTO } from "@/src/common/interfaces/IPatient";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";
import type { IPatientRegisterRequest } from "../interfaces/IPatientRegisterRequest";

const endpoint = "/patients";

const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IPatient>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IPatient>> =>
  apiService.get(`${endpoint}/${id}/`);

const update = (id: string, data: IPatientUpdateDTO): Promise<AxiosResponse<IPatient>> =>
  apiService.patch(`${endpoint}/${id}/`, data);

const register = (data: IPatientRegisterRequest): Promise<AxiosResponse<{ message: string }>> =>
    apiService.post(`${endpoint}/register/`, data);

export const patientService = {
  getAll,
  getById,
  update,
  register,
};
