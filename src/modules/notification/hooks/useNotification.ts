import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/src/modules/notification/services/notification.service';
import type { ISendManualNotificationRequest, IRunAutomatedNotificationsRequest } from '@/src/modules/notification/interfaces/INotification';

export const useSendManualNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ISendManualNotificationRequest) => notificationService.sendManual(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contactHistory'] });
        },
    });
};

export const useRunAutomatedNotifications = () => {
    return useMutation({
        mutationFn: (data: IRunAutomatedNotificationsRequest) => notificationService.runAutomated(data),
    });
};
