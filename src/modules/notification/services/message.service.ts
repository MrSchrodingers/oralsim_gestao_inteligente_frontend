import apiService from "@/src/common/services/api.service";
import type { AxiosResponse } from "axios";
import type { IMessage, IMessageCreateDTO, IMessageUpdateDTO } from "../interfaces/IMessage";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/messages";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IMessage>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IMessage>> =>
  apiService.get(`${endpoint}/${id}/`);

const create = (data: IMessageCreateDTO): Promise<AxiosResponse<IMessage>> =>
  apiService.post(endpoint, data);

const update = (id: string, data: IMessageUpdateDTO): Promise<AxiosResponse<IMessage>> =>
  apiService.put(`${endpoint}/${id}/`, data);

const remove = (id: string): Promise<AxiosResponse<void>> =>
  apiService.delete(`${endpoint}/${id}/`);

export const messageService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
