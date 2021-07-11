import { SessionStorageKeys } from '../constants/storage';

export function storeDataInSessionStorage(
  key: SessionStorageKeys,
  data: Record<string, any>,
): void {
  let dataToStore: string;

  try {
    dataToStore = JSON.stringify(data);
  } catch {
    throw new Error('Failed to parse JSON data to string');
  }

  window.sessionStorage.setItem(key, dataToStore);
}

export function getDataFromSessionStorage<Type = string>(
  key: SessionStorageKeys,
): Type {
  const data = window.sessionStorage.getItem(key);

  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      throw new Error('Failed to parse string data to JSON');
    }
  }
}
