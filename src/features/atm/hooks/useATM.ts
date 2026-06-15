import { useATMContext } from "../store/atmStore";

export function useATM() {
  return useATMContext();
}
