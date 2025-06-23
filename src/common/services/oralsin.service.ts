import axios, { type AxiosResponse } from "axios";
import type { IOralsinPagedResponse } from "../interfaces/IOralsin";

const oralsinApi = axios.create({
  baseURL: "https://hmldh.oralsin.com.br/api/v2",
});

const searchClinics = (
  search: string
): Promise<AxiosResponse<IOralsinPagedResponse>> => {
  return oralsinApi.get("/clinica", {
    params: {
      search,
      api_token: "ae48ba16-92b2-4f59-b0b5-d43cc998a30d",
    },
  });
};

export const oralsinService = {
  searchClinics,
};