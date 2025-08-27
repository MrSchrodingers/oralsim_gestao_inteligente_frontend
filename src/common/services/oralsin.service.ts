import axios, { type AxiosResponse } from "axios";
import type { IOralsinPagedResponse } from "../interfaces/IOralsin";

const oralsinApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_ORALSIN,
});

const searchClinics = (
  search: string
): Promise<AxiosResponse<IOralsinPagedResponse>> => {
  return oralsinApi.get("/clinica", {
    params: {
      search,
      api_token: process.env.NEXT_PUBLIC_API_TOKEN_ORALSIN,
    },
  });
};

const getClinicById = (
  id: number
): Promise<AxiosResponse<IOralsinPagedResponse>> => {
  return oralsinApi.get(`/clinica/${id}`, {
    params: { api_token: process.env.NEXT_PUBLIC_API_TOKEN_ORALSIN },
  });
};

export const oralsinService = {
  searchClinics,
  getClinicById
};