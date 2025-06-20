import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdownMenu";
import { AlertCircle, CheckCircle, Loader2, PhoneCall } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useMarkPendingCallDone } from "@/src/modules/notification/hooks/usePendingCall";

export function CallCompletionDialog({
  call,
  onComplete,
}: { call: any; onComplete: (success: boolean, notes: string) => void }) {
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const { mutateAsync: markDone } = useMarkPendingCallDone();

  const handleSubmit = async (success: boolean) => {
    setIsSubmitting(true);
    try {
      await markDone({ id: call.id, success, notes });
      setOpen(false);
      setNotes("");
    } catch (err) {
      console.error("Falha ao marcar call:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <PhoneCall className="h-4 w-4 mr-2" />
          Marcar como Feita
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Ligação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {call.patient.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{call.patient.name}</p>
                <p className="text-sm text-muted-foreground">{call.patient.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações da ligação</Label>
            <Textarea
              id="notes"
              placeholder="Descreva o resultado da ligação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={() => handleSubmit(true)} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Ligação Realizada
            </Button>
            <Button variant="outline" onClick={() => handleSubmit(false)} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              Não Atendeu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}