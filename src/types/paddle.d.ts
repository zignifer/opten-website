// Paddle.js v2 global type declarations — Phase 66 D-15
// Augments window.Paddle for the 4 methods we use in main.tsx + PayPage.tsx.
// Ref: https://developer.paddle.com/paddlejs/methods/paddle-checkout-open (verified 2026-04-21)
export {};

declare global {
  interface PaddleCheckoutEvent {
    name: string;
    data?: unknown;
  }

  interface PaddleCheckoutOpenOptions {
    items: Array<{ priceId: string; quantity: number }>;
    customer?: { id?: string; email?: string };
    customData?: Record<string, unknown>;
    settings?: {
      theme?: "dark" | "light";
      locale?: string;
      successUrl?: string;
      displayMode?: "overlay" | "inline";
      variant?: "multi-page" | "one-page";
      allowLogout?: boolean;
      showAddDiscounts?: boolean;
      showAddTaxId?: boolean;
    };
    eventCallback?: (event: PaddleCheckoutEvent) => void;
  }

  interface Window {
    Paddle?: {
      Environment: { set: (env: "sandbox" | "production") => void };
      Initialize: (options: {
        token: string;
        eventCallback?: (event: PaddleCheckoutEvent) => void;
      }) => void;
      Checkout: { open: (options: PaddleCheckoutOpenOptions) => void };
    };
  }
}
