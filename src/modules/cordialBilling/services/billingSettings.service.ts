import type { AxiosResponse } from "axios";
import type { IBillingSettings } from "../interfaces/IBillingSettings";
import apiService from "@/src/common/services/api.service";

const endpoint = "/billing-settings";

const getByClinicId = (clinicId: string): Promise<AxiosResponse<IBillingSettings>> =>
  apiService.get(`${endpoint}/${clinicId}/`);

const update = (clinicId: string, data: IBillingSettings): Promise<AxiosResponse<IBillingSettings>> =>
  apiService.put(`${endpoint}/${clinicId}/`, data);

export const billingSettingsService = {
  getByClinicId,
  update,
};
