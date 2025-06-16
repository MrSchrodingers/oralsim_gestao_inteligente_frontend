import apiService from "./api.service";
import type { AxiosResponse } from "axios";
import type { IPaymentMethod } from "@/src/common/interfaces/IPaymentMethod";
import type { IPagedResponse } from "@/src/common/interfaces/IPagedResponse";

const endpoint = "/payment-methods";

const getAll = (params?: Record<string, any>): Promise<AxiosResponse<IPagedResponse<IPaymentMethod>>> =>
    apiService.get(endpoint, { params });

export const paymentMethodService = {
    getAll,
};
