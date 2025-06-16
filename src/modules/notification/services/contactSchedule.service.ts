import type { AxiosResponse } from "axios";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";
import type { IContactSchedule, IContactScheduleCreateDTO, IContactScheduleUpdateDTO } from "../interfaces/IContactSchedule";
import apiService from "@/src/common/services/api.service";

const endpoint = "/contact-schedules";

const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IContactSchedule>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IContactSchedule>> =>
  apiService.get(`${endpoint}/${id}/`);

const create = (data: IContactScheduleCreateDTO): Promise<AxiosResponse<IContactSchedule>> =>
  apiService.post(endpoint, data);

const update = (id: string, data: IContactScheduleUpdateDTO): Promise<AxiosResponse<IContactSchedule>> =>
  apiService.put(`${endpoint}/${id}/`, data);

const remove = (id: string): Promise<AxiosResponse<void>> =>
  apiService.delete(`${endpoint}/${id}/`);

export const contactScheduleService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
