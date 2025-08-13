import type { AxiosResponse } from "axios";
import type { IBillingSettings } from "../interfaces/IBillingSettings";
import apiService from "@/src/common/services/api.service";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/billing-settings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getByClinicId = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IBillingSettings>>> =>
  apiService.get(`${endpoint}`, { params });

const update = (data: IBillingSettings): Promise<AxiosResponse<IBillingSettings>> =>
  apiService.put(`${endpoint}`, data);

export const billingSettingsService = {
  getByClinicId,
  update,
};
