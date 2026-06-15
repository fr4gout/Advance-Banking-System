import { fetchNui as bankingFetchNui, isNuiEnvironment } from "@/features/banking/nui/bridge";

export function isEnvBrowser(): boolean {
  return !isNuiEnvironment();
}

export async function fetchNui<T>(
  event: string,
  data?: unknown,
  mockData?: T,
): Promise<T> {
  if (isEnvBrowser()) {
    console.debug(`[ATM NUI Dev] ${event}`, data);
    if (mockData !== undefined) return mockData;
  }

  const result = await bankingFetchNui<unknown>(event, data);
  if (isEnvBrowser() && mockData !== undefined) return mockData;
  return result as T;
}
