import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IUser, IUserCreateDTO, IUserUpdateDTO, IUserFullData, IRegistrationRequestCreateDTO } from "@/src/common/interfaces/IUser";
import type { ILoginRequest, ILoginResponse } from "@/src/common/interfaces/ILogin";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/users";
const authEndpoint = "/auth";
const registrationEndpoint = "/registration-requests"; 

const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IUser>>> =>
  apiService.get(endpoint, { params });

const getById = (id: string): Promise<AxiosResponse<IUserFullData>> =>
  apiService.get(`${endpoint}/${id}/`);

const create = (data: IUserCreateDTO): Promise<AxiosResponse<IUser>> =>
  apiService.post(endpoint, data);

const update = (id: string, data: IUserUpdateDTO): Promise<AxiosResponse<IUser>> =>
  apiService.put(`${endpoint}/${id}/`, data);

const remove = (id: string): Promise<AxiosResponse<void>> =>
  apiService.delete(`${endpoint}/${id}/`);

const login = (credentials: ILoginRequest): Promise<AxiosResponse<{ access: string; refresh: string; user: IUser }>> =>
  apiService.post(`login/`, credentials);

// const refreshToken = (refresh: string): Promise<AxiosResponse<{ access: string }>> =>
    // apiService.post(`${authEndpoint}/token/refresh/`, { refresh });

const getCurrentUser = (): Promise<AxiosResponse<IUserFullData>> =>
    apiService.get(`me/`);

const requestPasswordReset = (data: ILoginRequest): Promise<AxiosResponse<ILoginResponse>> =>
  apiService.post(`${authEndpoint}/request-password-reset/`, data);

const requestRegistration = (data: IRegistrationRequestCreateDTO): Promise<AxiosResponse<{ message: string }>> =>
  apiService.post(registrationEndpoint, data);


export const userService = {
  getAll,
  getById,
  create,
  update,
  remove,
  login,
  getCurrentUser,
  requestPasswordReset,
  requestRegistration
};
