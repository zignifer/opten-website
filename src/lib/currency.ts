import { useEffect, useState } from "react";
import { useLang } from "../i18n/LangContext";

export const CURRENCY_STORAGE_KEY = "opten_pay_currency";
export const CURRENCY_CHANGE_EVENT = "opten:currency-change";

export type Currency = "RUB" | "USD";

export function langToCurrency(lang: string): Currency {
  return lang === "ru" ? "RUB" : "USD";
}

export function readCurrencyPreference(lang: string): Currency {
  if (typeof window === "undefined") return langToCurrency(lang);
  const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
  return stored === "RUB" || stored === "USD" ? stored : langToCurrency(lang);
}

export function setCurrencyPreference(currency: Currency) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  window.dispatchEvent(new CustomEvent<Currency>(CURRENCY_CHANGE_EVENT, { detail: currency }));
}

export function useCurrencyPreference(): [Currency, (currency: Currency) => void] {
  const { lang } = useLang();
  const [currency, setCurrency] = useState<Currency>(() => readCurrencyPreference(lang));

  useEffect(() => {
    setCurrency(readCurrencyPreference(lang));
  }, [lang]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CURRENCY_STORAGE_KEY) setCurrency(readCurrencyPreference(lang));
    };
    const handleCurrencyChange = (event: Event) => {
      const next = (event as CustomEvent<Currency>).detail;
      if (next === "RUB" || next === "USD") setCurrency(next);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(CURRENCY_CHANGE_EVENT, handleCurrencyChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CURRENCY_CHANGE_EVENT, handleCurrencyChange);
    };
  }, [lang]);

  return [currency, setCurrencyPreference];
}

export function formatCurrencyPrice(value: number, currency: Currency): string {
  if (currency === "USD") {
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
    return `$${formatted}`;
  }

  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)} ₽`;
}

