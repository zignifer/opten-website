import { SUPABASE_ANON_KEY, SUPABASE_FUNCTIONS_URL } from "./optenAuth";
import type { Currency } from "./currency";

export type CourseAccessSummary = {
  course_slug: string;
  has_access: boolean;
  status: "active" | "none" | string;
  email: string | null;
  granted_at: string | null;
  error?: string;
};

export type CoursePaymentResponse = {
  provider?: "yookassa" | "paddle";
  confirmation_url?: string;
  price_id?: string;
  customer_email?: string;
  custom_data?: Record<string, string>;
  order_id?: string;
  amount_value?: number;
  list_amount_value?: number;
  discount_percent?: number;
  promo_discount_percent?: number | null;
  promo_code?: string | null;
  discount_code?: string | null;
  discount_id?: string | null;
  currency?: Currency;
  error?: string;
};

export const COURSE_TEST_PROMO_CODE = "FREE";

export function normalizeCourseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidCourseEmail(email: string): boolean {
  const normalized = normalizeCourseEmail(email);
  return normalized.length >= 3 && normalized.length <= 320 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized);
}

export function formatRubPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value);
}

export function normalizeCoursePromoCode(value: string): string {
  return value.trim().toUpperCase();
}

export function isCourseTestPromoCode(value: string): boolean {
  return normalizeCoursePromoCode(value) === COURSE_TEST_PROMO_CODE;
}

export function isValidCoursePromoCode(value: string): boolean {
  const normalized = normalizeCoursePromoCode(value);
  return /^[A-Z0-9]{1,32}$/.test(normalized);
}

export function formatCoursePrice(value: number, currency: Currency): string {
  if (currency === "USD") {
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
    return `$${formatted}`;
  }

  return `${formatRubPrice(value)} ₽`;
}

export async function fetchCourseAccessSummary(accessToken: string, courseSlug: string): Promise<CourseAccessSummary> {
  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/course-access-summary`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ course_slug: courseSlug }),
  });
  const body = (await response.json().catch(() => ({}))) as CourseAccessSummary;
  if (!response.ok || body.error) throw new Error(body.error || "course_access_failed");
  return body;
}

export async function createCoursePayment(
  courseSlug: string,
  email: string,
  returnUrl: string,
  currency: Currency = "RUB",
  promoCode?: string,
): Promise<CoursePaymentResponse> {
  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-course-payment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      course_slug: courseSlug,
      email: normalizeCourseEmail(email),
      return_url: returnUrl,
      currency,
      promo_code: promoCode ? normalizeCoursePromoCode(promoCode) : undefined,
    }),
  });
  const body = (await response.json().catch(() => ({}))) as CoursePaymentResponse;
  if (!response.ok || body.error) throw new Error(body.error || "course_payment_failed");
  return body;
}

export async function quoteCoursePayment(
  courseSlug: string,
  currency: Currency = "RUB",
  promoCode?: string,
): Promise<CoursePaymentResponse> {
  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-course-payment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      course_slug: courseSlug,
      currency,
      promo_code: promoCode ? normalizeCoursePromoCode(promoCode) : undefined,
      quote_only: true,
    }),
  });
  const body = (await response.json().catch(() => ({}))) as CoursePaymentResponse;
  if (!response.ok || body.error) throw new Error(body.error || "course_quote_failed");
  return body;
}
