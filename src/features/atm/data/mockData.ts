import type { BankCard } from "../types/bankCard";
import type { Account } from "../types/account";

export const MOCK_PIN = "1234";

export const mockCards: BankCard[] = [
  {
    id: "card-1",
    holderName: "NABIL NAIMUR",
    cardNumber: "4532123456789281",
    expiryDate: "04/29",
    cardType: "Visa",
    bankName: "SOUL BANK",
    pin: MOCK_PIN,
  },
  {
    id: "card-2",
    holderName: "NABIL NAIMUR",
    cardNumber: "5425233430109903",
    expiryDate: "11/28",
    cardType: "Mastercard",
    bankName: "MAZE BANK",
    pin: MOCK_PIN,
  },
  {
    id: "card-3",
    holderName: "JANE DOE",
    cardNumber: "4111111111111111",
    expiryDate: "08/27",
    cardType: "Visa",
    bankName: "FLEECA",
    pin: MOCK_PIN,
  },
];

export const mockAccount: Account = {
  balance: 125_000,
  atmLimit: 10_000,
  accountType: "Checking",
};
