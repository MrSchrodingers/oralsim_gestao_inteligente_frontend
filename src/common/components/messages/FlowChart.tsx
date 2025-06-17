import type { IFlowStepConfig } from "@/src/modules/notification/interfaces/IFlowStepConfig";
import type { IMessage } from "@/src/modules/notification/interfaces/IMessage";
import { useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Clock } from "lucide-react";
import { getChannelBadge, getChannelIcon } from "../helpers/GetBadge";
import { MessagePreview } from "./MessagePreview";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFetchMessages } from "@/src/modules/notification/hooks/useMessage";
import { useFetchFlowStepConfigs } from "@/src/modules/notification/hooks/useFlowStepConfig";

export const FlowChart = () => {
  const { data: messagesData, isLoading } = useFetchMessages({page_size: 10000 })
  const { data: flowStepData } = useFetchFlowStepConfigs({page_size: 10000 })

  const messages: IMessage[] = messagesData?.results ?? []     
  const flowSteps: IFlowStepConfig[] = flowStepData?.results ?? []

  // agrupa mensagens por step
  const stepMessages = useMemo(() => {
    const map = new Map<number, IMessage[]>();
    messages.forEach((m) => {
      if (!map.has(m.step)) map.set(m.step, []);
      map.get(m.step)!.push(m);
    });
    return map;
  }, [messages]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Fluxo de Notificações</h3>
        <p className="text-muted-foreground">
          Visualize como as mensagens são enviadas em cada etapa do processo
        </p>
      </div>

      <div className="space-y-4">
        {flowSteps.map((step, idx) => {
          const allMsgs = stepMessages.get(step.step_number) || [];
          const totalMsgs = allMsgs.length;

          return (
            <Card
              key={step.id}
              className={`${step.active ? "border-primary/20" : "border-muted opacity-60"}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        step.active ? "bg-primary" : "bg-muted-foreground"
                      }`}
                    >
                      {step.step_number}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{step.description}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {step.cooldown_days} dias
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {step.channels.map((ch, i) => (
                        <div key={i}>{getChannelBadge(ch)}</div>
                      ))}
                    </div>

                    {totalMsgs > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-muted-foreground">
                          Mensagens nesta etapa ({totalMsgs})
                        </h5>
                        <div className="grid gap-2">
                          {allMsgs.map((msg) => (
                            <div
                              key={msg.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {getChannelIcon(msg.type)}
                                <div>
                                  <p className="text-sm font-medium">
                                    {msg.type === "whatsapp"
                                      ? "WhatsApp"
                                      : msg.type === "sms"
                                      ? "SMS"
                                      : msg.type === "email"
                                      ? "E-mail"
                                      : msg.type === "phonecall"
                                      ? "Ligação"
                                      : msg.type}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {msg.content.substring(0, 50)}...
                                  </p>
                                </div>
                              </div>
                              <MessagePreview message={msg} />
                            </div>
                          ))}
                        </div>

                      </div>
                    )}
                  </div>
                </div>

                {idx < flowSteps.length - 1 && (
                  <div className="flex justify-center mt-4">
                    <div className="w-px h-8 bg-border"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
