import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { ICoveredClinic } from "@/src/common/interfaces/ICoveredClinic";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/covered-clinics";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<ICoveredClinic>>> =>
  apiService.get(endpoint, { params });

export const coveredClinicService = {
  getAll,
};
