import { useEffect } from "react";
import type { NuiInboundEvent } from "../types/nui";
import { useATMContext } from "../store/atmStore";

export function useNuiEvent() {
  const { openATM, closeATM, updateCards, updateBalance } = useATMContext();

  useEffect(() => {
    const handler = (event: MessageEvent<NuiInboundEvent>) => {
      const message = event.data;
      if (!message?.action) return;

      switch (message.action) {
        case "openATM":
        case "OpenATM":
          openATM(message.data);
          break;
        case "CloseATM":
          closeATM();
          break;
        case "UpdateCards":
          updateCards(message.data.cards);
          break;
        case "UpdateBalance":
          updateBalance(message.data.balance, message.data.atmLimit);
          break;
        default: {
          const _exhaustive: never = message;
          console.debug("Unhandled NUI event", _exhaustive);
          break;
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [closeATM, openATM, updateBalance, updateCards]);
}
