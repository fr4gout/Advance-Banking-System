import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Contact } from "@/features/banking/types/banking";
import {
  DEFAULT_REQUEST_DRAFT,
  DEFAULT_TRANSFER_DRAFT,
  MOBILE_PASSCODE,
  MOBILE_TAB_ORDER,
  type LockMode,
  type MobileTab,
  type RequestDraft,
  type TransferDraft,
} from "../types/mobile";
import { fetchNui } from "@/features/banking/nui/bridge";

const UNLOCK_MS = 280;
const FACE_ID_MS = 1200;

export interface MobileContextValue {
  isVisible: boolean;
  isLocked: boolean;
  isUnlocking: boolean;
  lockMode: LockMode;
  passcodeInput: string;
  passcodeError: boolean;
  faceIdScanning: boolean;
  activeTab: MobileTab;
  tabDirection: 1 | -1;
  transferDraft: TransferDraft;
  requestOpen: boolean;
  requestDraft: RequestDraft;
  selectedInvoiceId: string | null;
  addContactOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  lock: () => void;
  unlock: () => void;
  setLockMode: (mode: LockMode) => void;
  setPasscodeInput: (value: string) => void;
  clearPasscodeError: () => void;
  verifyPasscode: (code?: string) => boolean;
  startFaceIdScan: () => void;
  setTab: (tab: MobileTab) => void;
  setTransferDraft: (patch: Partial<TransferDraft>) => void;
  resetTransferDraft: () => void;
  openRequest: () => void;
  closeRequest: () => void;
  setRequestDraft: (patch: Partial<RequestDraft>) => void;
  resetRequestDraft: () => void;
  prefillTransferContact: (contact: Contact) => void;
  setSelectedInvoiceId: (id: string | null) => void;
  setAddContactOpen: (open: boolean) => void;
}

const MobileContext = createContext<MobileContextValue | null>(null);

export function MobileProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [lockMode, setLockMode] = useState<LockMode>("face");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [faceIdScanning, setFaceIdScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<MobileTab>("dashboard");
  const [tabDirection, setTabDirection] = useState<1 | -1>(1);
  const [transferDraft, setTransferDraftState] = useState<TransferDraft>(
    DEFAULT_TRANSFER_DRAFT,
  );
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestDraft, setRequestDraftState] = useState<RequestDraft>(
    DEFAULT_REQUEST_DRAFT,
  );
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [addContactOpen, setAddContactOpen] = useState(false);
  const timersRef = useRef<Set<number>>(new Set());

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current.delete(id);
      fn();
    }, ms);
    timersRef.current.add(id);
    return id;
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const id of timers) {
        window.clearTimeout(id);
      }
      timers.clear();
    };
  }, []);

  const finishUnlock = useCallback(() => {
    setIsLocked(false);
    setIsUnlocking(false);
    setPasscodeInput("");
    setPasscodeError(false);
    setFaceIdScanning(false);
  }, []);

  const beginUnlock = useCallback(() => {
    setIsUnlocking(true);
    schedule(finishUnlock, UNLOCK_MS);
  }, [finishUnlock, schedule]);

  const openMobile = useCallback(() => {
    setIsVisible(true);
    setIsLocked(true);
    setIsUnlocking(false);
    setLockMode("face");
    setPasscodeInput("");
    setPasscodeError(false);
    setFaceIdScanning(false);
  }, []);

  const closeMobile = useCallback(() => {
    setIsVisible(false);
    setActiveTab("dashboard");
    setTabDirection(1);
    setTransferDraftState(DEFAULT_TRANSFER_DRAFT);
    setRequestOpen(false);
    setRequestDraftState(DEFAULT_REQUEST_DRAFT);
    setSelectedInvoiceId(null);
    setAddContactOpen(false);
    void fetchNui("close");
  }, []);

  const lock = useCallback(() => {
    setIsLocked(true);
    setIsUnlocking(false);
    setLockMode("face");
    setPasscodeInput("");
    setPasscodeError(false);
    setFaceIdScanning(false);
  }, []);

  const unlock = useCallback(() => {
    if (isUnlocking) return;
    beginUnlock();
  }, [beginUnlock, isUnlocking]);

  const clearPasscodeError = useCallback(() => {
    setPasscodeError(false);
  }, []);

  const verifyPasscode = useCallback(
    (code?: string) => {
      const input = code ?? passcodeInput;
      if (input === MOBILE_PASSCODE) {
        unlock();
        return true;
      }
      setPasscodeError(true);
      setPasscodeInput("");
      return false;
    },
    [passcodeInput, unlock],
  );

  const startFaceIdScan = useCallback(() => {
    if (faceIdScanning || isUnlocking) return;
    setFaceIdScanning(true);
    schedule(() => {
      setFaceIdScanning(false);
      beginUnlock();
    }, FACE_ID_MS);
  }, [faceIdScanning, isUnlocking, beginUnlock, schedule]);

  const setTab = useCallback((tab: MobileTab) => {
    setActiveTab((prev) => {
      const prevIdx = MOBILE_TAB_ORDER.indexOf(prev);
      const nextIdx = MOBILE_TAB_ORDER.indexOf(tab);
      setTabDirection(nextIdx >= prevIdx ? 1 : -1);
      return tab;
    });
    setSelectedInvoiceId(null);
  }, []);

  const setTransferDraft = useCallback((patch: Partial<TransferDraft>) => {
    setTransferDraftState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetTransferDraft = useCallback(() => {
    setTransferDraftState(DEFAULT_TRANSFER_DRAFT);
  }, []);

  const openRequest = useCallback(() => {
    setRequestDraftState(DEFAULT_REQUEST_DRAFT);
    setRequestOpen(true);
  }, []);

  const closeRequest = useCallback(() => {
    setRequestOpen(false);
    setRequestDraftState(DEFAULT_REQUEST_DRAFT);
  }, []);

  const setRequestDraft = useCallback((patch: Partial<RequestDraft>) => {
    setRequestDraftState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetRequestDraft = useCallback(() => {
    setRequestDraftState(DEFAULT_REQUEST_DRAFT);
  }, []);

  const prefillTransferContact = useCallback((contact: Contact) => {
    setTransferDraftState({
      ...DEFAULT_TRANSFER_DRAFT,
      step: 2,
      selectedContact: contact,
      toIban: contact.iban,
    });
    setActiveTab("transfer");
    setTabDirection(1);
  }, []);

  const value = useMemo<MobileContextValue>(
    () => ({
      isVisible,
      isLocked,
      isUnlocking,
      lockMode,
      passcodeInput,
      passcodeError,
      faceIdScanning,
      activeTab,
      tabDirection,
      transferDraft,
      requestOpen,
      requestDraft,
      selectedInvoiceId,
      addContactOpen,
      openMobile,
      closeMobile,
      lock,
      unlock,
      setLockMode,
      setPasscodeInput,
      clearPasscodeError,
      verifyPasscode,
      startFaceIdScan,
      setTab,
      setTransferDraft,
      resetTransferDraft,
      openRequest,
      closeRequest,
      setRequestDraft,
      resetRequestDraft,
      prefillTransferContact,
      setSelectedInvoiceId,
      setAddContactOpen,
    }),
    [
      isVisible,
      isLocked,
      isUnlocking,
      lockMode,
      passcodeInput,
      passcodeError,
      faceIdScanning,
      activeTab,
      tabDirection,
      transferDraft,
      requestOpen,
      requestDraft,
      selectedInvoiceId,
      addContactOpen,
      openMobile,
      closeMobile,
      lock,
      unlock,
      clearPasscodeError,
      verifyPasscode,
      startFaceIdScan,
      setTab,
      setTransferDraft,
      resetTransferDraft,
      openRequest,
      closeRequest,
      setRequestDraft,
      resetRequestDraft,
      prefillTransferContact,
    ],
  );

  return (
    <MobileContext.Provider value={value}>{children}</MobileContext.Provider>
  );
}

export function useMobileContext(): MobileContextValue {
  const ctx = useContext(MobileContext);
  if (!ctx) {
    throw new Error("useMobileContext must be used within MobileProvider");
  }
  return ctx;
}
