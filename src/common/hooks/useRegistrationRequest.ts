import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { IPendingClinic } from '../interfaces/IPendingClinic';
import type { IPagedResponse } from '../interfaces/IPagedResponse';
import { registrationRequestService } from '../services/registrationRequest.service';

const REGISTRATION_REQUEST_QUERY_KEY = 'registrationRequests';

export const useFetchRegistrationRequests = (params?: Record<string, any>) =>
  useQuery<IPagedResponse<IPendingClinic>>({
    queryKey: [REGISTRATION_REQUEST_QUERY_KEY, params],
    queryFn: () => registrationRequestService.getAll(params).then(res => res.data),
  });

export const useFetchRegistrationRequestById = (id: string) =>
  useQuery<IPendingClinic>({
    queryKey: [REGISTRATION_REQUEST_QUERY_KEY, id],
    queryFn: () => registrationRequestService.getById(id).then(res => res.data),
    enabled: !!id,
  });

export const useApproveRegistrationRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => registrationRequestService.approve(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATION_REQUEST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [REGISTRATION_REQUEST_QUERY_KEY, id] });
    },
  });
};

export const useRejectRegistrationRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => registrationRequestService.reject(id).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [REGISTRATION_REQUEST_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [REGISTRATION_REQUEST_QUERY_KEY, id] });
    },
  });
};