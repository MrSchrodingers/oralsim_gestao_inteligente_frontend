"use client";
import { setupAxiosInterceptors } from "@/setupInterceptors";
import axios from "axios";

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
});

setupAxiosInterceptors(apiService);

export default apiService;