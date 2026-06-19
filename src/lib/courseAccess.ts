import { SUPABASE_ANON_KEY, SUPABASE_FUNCTIONS_URL } from "./optenAuth";

export type CourseAccessSummary = {
  course_slug: string;
  has_access: boolean;
  status: "active" | "none" | string;
  email: string | null;
  granted_at: string | null;
  error?: string;
};

export type CoursePaymentResponse = {
  confirmation_url?: string;
  order_id?: string;
  amount_value?: number;
  list_amount_value?: number;
  discount_percent?: number;
  currency?: "RUB";
  error?: string;
};

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

export async function createCoursePayment(courseSlug: string, email: string, returnUrl: string): Promise<CoursePaymentResponse> {
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
    }),
  });
  const body = (await response.json().catch(() => ({}))) as CoursePaymentResponse;
  if (!response.ok || body.error) throw new Error(body.error || "course_payment_failed");
  return body;
}
