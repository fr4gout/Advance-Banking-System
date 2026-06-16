import type { BankCard } from "./bankCard";

export type NuiInboundEvent =
  | { action: "openATM"; data?: { balance?: number; atmLimit?: number } }
  | { action: "OpenATM"; data?: { balance?: number; atmLimit?: number } }
  | { action: "CloseATM" }
  | { action: "UpdateCards"; data: { cards: BankCard[] } }
  | { action: "UpdateBalance"; data: { balance: number; atmLimit?: number } };

export type NuiOutboundEvent =
  | { event: "SelectCard"; data: { cardId: string } }
  | { event: "VerifyPin"; data: { cardId: string; pin: string } }
  | { event: "WithdrawMoney"; data: { cardId: string; amount: number } }
  | { event: "CloseATM" };

export interface NuiMessageData<T = unknown> {
  action: string;
  data?: T;
}
