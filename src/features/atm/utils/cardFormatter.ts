export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, "");
  const lastFour = digits.slice(-4);
  return `**** **** **** ${lastFour}`;
}

export function formatExpiry(expiryDate: string): string {
  return expiryDate;
}
