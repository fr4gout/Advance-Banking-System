export interface BankCard {
  id: string;
  holderName: string;
  cardNumber: string;
  expiryDate: string;
  cardType: "Visa" | "Mastercard";
  bankName: string;
  pin?: string;
}
