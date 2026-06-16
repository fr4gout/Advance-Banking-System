import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockAccount, mockCards } from "../data/mockData";
import { isNuiEnvironment } from "@/features/banking/nui/bridge";
import type { ATMView } from "../types/atm";
import type { BankCard } from "../types/bankCard";
import { fetchNui } from "../utils/nui";

export interface ATMContextValue {
  currentView: ATMView;
  selectedCard: BankCard | null;
  pin: string;
  withdrawAmount: number;
  balance: number;
  atmLimit: number;
  cards: BankCard[];
  isVisible: boolean;
  pinError: boolean;
  isLoading: boolean;
  accountType: string;
  lastAccessTime: string | null;
  selectCard: (card: BankCard) => void;
  setPin: (pin: string) => void;
  verifyPin: () => Promise<void>;
  setWithdrawAmount: (amount: number) => void;
  addQuickAmount: (amount: number) => void;
  setMaxWithdraw: () => void;
  clearWithdrawAmount: () => void;
  withdraw: () => Promise<void>;
  goBack: () => void;
  openATM: (data?: { balance?: number; atmLimit?: number }) => void;
  closeATM: () => void;
  updateCards: (cards: BankCard[]) => void;
  updateBalance: (balance: number, atmLimit?: number) => void;
  clearPinError: () => void;
}

const ATMContext = createContext<ATMContextValue | null>(null);

function getInitialVisibility(): boolean {
  return false;
}

export function ATMProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<ATMView>("SELECT_CARD");
  const [selectedCard, setSelectedCard] = useState<BankCard | null>(null);
  const [pin, setPinState] = useState("");
  const [withdrawAmount, setWithdrawAmountState] = useState(0);
  const [balance, setBalance] = useState(isNuiEnvironment() ? 0 : mockAccount.balance);
  const [atmLimit, setAtmLimit] = useState(isNuiEnvironment() ? 0 : mockAccount.atmLimit);
  const [cards, setCards] = useState<BankCard[]>(isNuiEnvironment() ? [] : mockCards);
  const [isVisible, setIsVisible] = useState(getInitialVisibility);
  const [pinError, setPinError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType] = useState(mockAccount.accountType);
  const [lastAccessTime, setLastAccessTime] = useState<string | null>(null);

  const resetSession = useCallback(() => {
    setCurrentView("SELECT_CARD");
    setSelectedCard(null);
    setPinState("");
    setWithdrawAmountState(0);
    setPinError(false);
    setIsLoading(false);
  }, []);

  const openATM = useCallback(
    (data?: { balance?: number; atmLimit?: number }) => {
      resetSession();
      if (data?.balance !== undefined) setBalance(data.balance);
      if (data?.atmLimit !== undefined) setAtmLimit(data.atmLimit);
      setIsVisible(true);
    },
    [resetSession],
  );

  const closeATM = useCallback(() => {
    setIsVisible(false);
    resetSession();
    void fetchNui("CloseATM");
  }, [resetSession]);

  const updateCards = useCallback((newCards: BankCard[]) => {
    setCards(newCards);
  }, []);

  const updateBalance = useCallback((newBalance: number, newLimit?: number) => {
    setBalance(newBalance);
    if (newLimit !== undefined) setAtmLimit(newLimit);
  }, []);

  const selectCard = useCallback((card: BankCard) => {
    setSelectedCard(card);
    setCurrentView("PIN_ENTRY");
    setPinState("");
    setPinError(false);
    void fetchNui("SelectCard", { cardId: card.id }, { success: true });
  }, []);

  const setPin = useCallback((value: string) => {
    setPinState(value);
    setPinError(false);
  }, []);

  const clearPinError = useCallback(() => {
    setPinError(false);
  }, []);

  const verifyPin = useCallback(async () => {
    if (!selectedCard || pin.length !== 4) return;

    setIsLoading(true);
    try {
      const expectedPin = selectedCard.pin ?? "1234";
      await fetchNui(
        "VerifyPin",
        { cardId: selectedCard.id, pin },
        { success: pin === expectedPin },
      );

      if (pin === expectedPin) {
        setLastAccessTime(new Date().toLocaleString());
        setCurrentView("DASHBOARD");
        setPinError(false);
      } else {
        setPinError(true);
        setPinState("");
      }
    } finally {
      setIsLoading(false);
    }
  }, [pin, selectedCard]);

  const setWithdrawAmount = useCallback((amount: number) => {
    setWithdrawAmountState(Math.max(0, amount));
  }, []);

  const addQuickAmount = useCallback((amount: number) => {
    setWithdrawAmountState((prev) => prev + amount);
  }, []);

  const setMaxWithdraw = useCallback(() => {
    setWithdrawAmountState(Math.min(balance, atmLimit));
  }, [balance, atmLimit]);

  const clearWithdrawAmount = useCallback(() => {
    setWithdrawAmountState(0);
  }, []);

  const withdraw = useCallback(async () => {
    if (!selectedCard || withdrawAmount <= 0) return;
    if (withdrawAmount > balance || withdrawAmount > atmLimit) return;

    setIsLoading(true);
    try {
      await fetchNui(
        "WithdrawMoney",
        { cardId: selectedCard.id, amount: withdrawAmount },
        { success: true },
      );
      setBalance((prev) => prev - withdrawAmount);
      setWithdrawAmountState(0);
    } finally {
      setIsLoading(false);
    }
  }, [atmLimit, balance, selectedCard, withdrawAmount]);

  const goBack = useCallback(() => {
    if (currentView === "PIN_ENTRY") {
      setCurrentView("SELECT_CARD");
      setSelectedCard(null);
      setPinState("");
      setPinError(false);
    } else if (currentView === "DASHBOARD") {
      closeATM();
    }
  }, [closeATM, currentView]);

  const value = useMemo<ATMContextValue>(
    () => ({
      currentView,
      selectedCard,
      pin,
      withdrawAmount,
      balance,
      atmLimit,
      cards,
      isVisible,
      pinError,
      isLoading,
      accountType,
      lastAccessTime,
      selectCard,
      setPin,
      verifyPin,
      setWithdrawAmount,
      addQuickAmount,
      setMaxWithdraw,
      clearWithdrawAmount,
      withdraw,
      goBack,
      openATM,
      closeATM,
      updateCards,
      updateBalance,
      clearPinError,
    }),
    [
      accountType,
      addQuickAmount,
      atmLimit,
      balance,
      cards,
      clearPinError,
      clearWithdrawAmount,
      closeATM,
      currentView,
      goBack,
      isLoading,
      isVisible,
      lastAccessTime,
      openATM,
      pin,
      pinError,
      selectCard,
      selectedCard,
      setMaxWithdraw,
      setPin,
      setWithdrawAmount,
      updateBalance,
      updateCards,
      verifyPin,
      withdraw,
      withdrawAmount,
    ],
  );

  return <ATMContext.Provider value={value}>{children}</ATMContext.Provider>;
}

export function useATMContext(): ATMContextValue {
  const context = useContext(ATMContext);
  if (!context) {
    throw new Error("useATMContext must be used within ATMProvider");
  }
  return context;
}
