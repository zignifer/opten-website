import { useCurrencyPreference } from "../../lib/currency";

interface CurrencySwitcherProps {
  className?: string;
  label?: string;
  onSwitch?: () => void;
}

export default function CurrencySwitcher({ className, label, onSwitch }: CurrencySwitcherProps): JSX.Element {
  const [currency, setCurrency] = useCurrencyPreference();
  const nextCurrency = currency === "RUB" ? "USD" : "RUB";
  const activeLabel = currency;

  return (
    <button
      type="button"
      aria-label={currency === "RUB" ? "Switch prices to USD" : "Переключить цены на рубли"}
      onClick={() => {
        setCurrency(nextCurrency);
        onSwitch?.();
      }}
      className={className}
    >
      {label ? (
        <>
          <span>{label}</span>
          <span>{activeLabel}</span>
        </>
      ) : (
        activeLabel
      )}
    </button>
  );
}
