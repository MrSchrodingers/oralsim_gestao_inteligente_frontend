import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IUserClinic, IUserClinicCreateDTO } from "@/src/common/interfaces/IUserClinic";

const endpoint = "/user-clinics";

const create = (data: IUserClinicCreateDTO): Promise<AxiosResponse<IUserClinic>> =>
  apiService.post(endpoint, data);

const remove = (id: string): Promise<AxiosResponse<void>> =>
  apiService.delete(`${endpoint}/${id}/`);

export const userClinicService = {
  create,
  remove,
};
