import { useLang } from "../../i18n/LangContext";
import { useCurrencyPreference } from "../../lib/currency";

function proMonthlyPrice(currency: "RUB" | "USD") {
  return currency === "USD" ? "$2.99" : "199 ₽";
}

function proOneTimePrice(currency: "RUB" | "USD") {
  return currency === "USD" ? "$4.99" : "299 ₽";
}

export function FooterDefinitionText(): JSX.Element {
  const { lang } = useLang();
  const [currency] = useCurrencyPreference();
  const monthly = proMonthlyPrice(currency);

  if (lang === "en") {
    return (
      <>
        Opten is a Chrome extension and AI prompt generator and optimizer that scores prompts for the specific model.
        Supports 60+ image and video models — Midjourney, GPT Image 2, Kling 3.0, Veo 3.1, Seedance, Nano Banana,
        Flux — and rewrites them in one click inside the Syntx, Higgsfield, and Freepik interfaces. From {monthly}/month.
      </>
    );
  }

  return (
    <>
      Opten — расширение Chrome, генератор и оптимизатор AI-промптов: оценивает и улучшает промпт под конкретную
      нейросеть. Поддерживает 60+ моделей: Midjourney, GPT Image 2, Kling 3.0, Veo 3.1, Seedance, Nano Banana, Flux.
      Работает в интерфейсе Syntx, Higgsfield, Freepik. От {monthly} в месяц.
    </>
  );
}

export function ModelPricingLine(): JSX.Element {
  const { lang } = useLang();
  const [currency] = useCurrencyPreference();
  const monthly = proMonthlyPrice(currency);

  if (lang === "en") {
    return <>Pro — {monthly}/mo · cancel any time</>;
  }

  return <>Pro — {monthly}/мес · отмена в любое время</>;
}

export function AboutPricingParagraph(): JSX.Element {
  const { lang } = useLang();
  const [currency] = useCurrencyPreference();
  const monthly = proMonthlyPrice(currency);
  const oneTime = proOneTimePrice(currency);
  const provider = currency === "USD" ? "Paddle" : "ЮKassa";

  if (lang === "en") {
    return (
      <p className="mb-[14px]">
        On pricing: <strong className="text-white font-semibold">install and registration are free</strong>. Pro is{" "}
        {monthly}/mo via {provider}, or {oneTime} one-time without a monthly subscription. That's five times cheaper
        than PromptPerfect ($9.99), and Opten works across dozens of interfaces rather than just inside its own chat.
      </p>
    );
  }

  return (
    <p className="mb-[14px]">
      По цене: <strong className="text-white font-semibold">установка и регистрация бесплатны</strong>. Pro —{" "}
      {monthly}/мес через {provider}, либо {oneTime} разово без подписки на месяц. Это в пять раз дешевле
      PromptPerfect ($9.99), и при этом Opten работает в десятках интерфейсов, а не только в собственном чате.
    </p>
  );
}
