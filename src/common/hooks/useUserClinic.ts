import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userClinicService } from '@/src/common/services/userClinic.service';
import type { IUserClinicCreateDTO } from '@/src/common/interfaces/IUserClinic';

const USER_CLINIC_QUERY_KEY = 'userClinics';
const USER_QUERY_KEY = 'users';

export const useCreateUserClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUserClinicCreateDTO) => userClinicService.create(data).then(res => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, data.user_id] });
    },
  });
};

export const useDeleteUserClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, userClinicId }: { userId: string, userClinicId: string }) => userClinicService.remove(userClinicId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, variables.userId] });
    },
  });
};
