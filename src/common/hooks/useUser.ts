import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/src/common/services/user.service';
import { useAuthStore, useAuthActions } from '@/src/common/stores/useAuthStore';
import type { IRegistrationRequestCreateDTO, IUser, IUserCreateDTO, IUserUpdateDTO } from '@/src/common/interfaces/IUser';
import type { ILoginRequest } from '../interfaces/ILogin';

const USER_QUERY_KEY = 'users';
const REGISTRATION_REQUEST_QUERY_KEY = 'registrationRequests';
const USER_DATA_QUERY_KEY = 'userdata';

export const useFetchUsers = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, params],
    queryFn: () => userService.getAll(params).then(res => res.data),
  });
};

export const useFetchUsersData = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [USER_DATA_QUERY_KEY, params],
    queryFn: () => userService.getUserData(params).then(res => res.data),
  });
};

export const useCreateRegistrationRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: (data: IRegistrationRequestCreateDTO) => userService.requestRegistration(data).then(res => res.data),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [REGISTRATION_REQUEST_QUERY_KEY] });
      },
  });
};

export const useFetchUserById = (id: string) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: () => userService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IUserCreateDTO) => userService.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUserUpdateDTO }) => userService.update(id, data).then(res => res.data),
    onSuccess: (data: IUser) => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      queryClient.setQueryData([USER_QUERY_KEY, data.id], data);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
    },
  });
};

export const useLogin = () => {
    const { login } = useAuthActions();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: ILoginRequest) => userService.login(credentials).then(res => res.data),
        onSuccess: (data) => {
            login(data.user, data.access, data.refresh);
            queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, 'me']});
        },
    });
};

export const useCurrentUser = () => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    return useQuery({
        queryKey: [USER_QUERY_KEY, 'me'],
        queryFn: () => userService.getCurrentUser().then(res => res.data),
        enabled: isAuthenticated,
        staleTime: Infinity,
    });
};
