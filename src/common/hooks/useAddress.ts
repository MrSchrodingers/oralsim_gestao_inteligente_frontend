import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '@/src/common/services/address.service';
import type { IAddress, IAddressCreateDTO, IAddressUpdateDTO } from '@/src/common/interfaces/IAddress';

const ADDRESS_QUERY_KEY = 'addresses';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFetchAddresses = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [ADDRESS_QUERY_KEY, params],
    queryFn: () => addressService.getAll(params).then(res => res.data),
  });
};

export const useFetchAddressById = (id: string) => {
  return useQuery({
    queryKey: [ADDRESS_QUERY_KEY, id],
    queryFn: () => addressService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IAddressCreateDTO) => addressService.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADDRESS_QUERY_KEY] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IAddressUpdateDTO }) => addressService.update(id, data).then(res => res.data),
    onSuccess: (data: IAddress) => {
      queryClient.invalidateQueries({ queryKey: [ADDRESS_QUERY_KEY] });
      queryClient.setQueryData([ADDRESS_QUERY_KEY, data.id], data);
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADDRESS_QUERY_KEY] });
    },
  });
};
