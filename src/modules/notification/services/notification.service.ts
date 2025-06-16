import apiService from "@/src/common/services/api.service";
import type { AxiosResponse } from "axios";
import type { ISendManualNotificationRequest, IRunAutomatedNotificationsRequest } from "../interfaces/INotification";

const endpoint = "/notifications";

const sendManual = (data: ISendManualNotificationRequest): Promise<AxiosResponse<{ message: string }>> =>
  apiService.post(`${endpoint}/send-manual/`, data);

const runAutomated = (data: IRunAutomatedNotificationsRequest): Promise<AxiosResponse<{ message: string }>> =>
  apiService.post(`${endpoint}/run-automated/`, data);

export const notificationService = {
  sendManual,
  runAutomated,
};
