/**
 * FiveM NUI bridge.
 *
 * Full contract: docs/NUI_CONTRACT.md
 *
 * Inbound (client.lua → UI): setVisible, setCharacter, setAccounts, setCashOnHand,
 *   pushTransaction, pushInvoice, setContacts, setCards, setLoanProducts,
 *   setCreditProfile, pushActiveLoan, OpenATM, CloseATM, UpdateCards, UpdateBalance
 *
 * Outbound (UI → client.lua): close, switchAccount, deposit, withdraw, transfer,
 *   payInvoice, saveContact, updateSocietyLimits, addSharedMember, updateSharedMember,
 *   removeSharedMember, applyForLoan, issueVirtualCard, updateCard,
 *   CloseATM, SelectCard, VerifyPin, WithdrawMoney
 *
 * In browser preview, fetchNui resolves { ok: true, preview: true }.
 */
import { useEffect } from "react";

declare global {
  interface Window {
    GetParentResourceName?: () => string;
    invokeNative?: (...args: unknown[]) => void;
  }
}

export const isNuiEnvironment = (): boolean =>
  typeof window !== "undefined" && typeof window.GetParentResourceName === "function";

export const getResourceName = (): string =>
  (typeof window !== "undefined" && window.GetParentResourceName?.()) || "banking-ui";

export async function fetchNui<TResponse = unknown, TPayload = unknown>(
  action: string,
  data?: TPayload,
): Promise<TResponse | { ok: true; preview: true }> {
  if (!isNuiEnvironment()) {
    // Browser preview: echo back so the UI flow continues.
    return { ok: true, preview: true } as const;
  }
  try {
    const res = await fetch(`https://${getResourceName()}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(data ?? {}),
    });
    return (await res.json()) as TResponse;
  } catch (err) {
    console.warn(`[NUI] ${action} failed`, err);
    return { ok: true, preview: true } as const;
  }
}

export interface NuiMessage<T = unknown> {
  action: string;
  data: T;
}

export function useNuiEvent<T = unknown>(action: string, handler: (data: T) => void) {
  useEffect(() => {
    const listener = (event: MessageEvent<NuiMessage<T>>) => {
      const payload = event.data;
      if (payload && payload.action === action) handler(payload.data);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [action, handler]);
}
