import { toast } from "sonner";

export function notifyBankingSuccess(message: string) {
  toast.success(message);
}

export function notifyBankingError(message: string) {
  toast.error(message);
}
