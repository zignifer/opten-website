export type AdminTelegramStats = {
  generated_at: string;
  funnel: {
    start: number;
    subscription_verified: number;
    access_granted: number;
    hidden_intro_opened: number;
    checkout_created: number;
    paid: number;
    blocked: number;
  };
  leads: {
    total: number;
    subscribed: number;
    access_granted: number;
    hidden_intro_opened: number;
    paid: number;
    blocked: number;
  };
  claims: {
    total: number;
    active: number;
    used: number;
    expired_unused: number;
  };
  orders: {
    created: number;
    paid: number;
  };
  events: Record<string, number>;
};

export type AdminTelegramBroadcastSegment = "all" | "subscribed" | "access_granted" | "access_granted_not_paid";

export type AdminTelegramBroadcastRequest = {
  text: string;
  photo_url?: string;
  button_text?: string;
  button_url?: string;
  segment: AdminTelegramBroadcastSegment;
  limit?: number;
  dry_run: boolean;
  confirm?: boolean;
  confirm_recipients?: number;
};

export type AdminTelegramBroadcastResult = {
  ok: boolean;
  dry_run?: boolean;
  broadcast_id?: string;
  segment: AdminTelegramBroadcastSegment;
  recipients: number;
  sent?: number;
  blocked?: number;
  failed?: number;
};

export type AdminTelegramBroadcastRecord = {
  id: string;
  kind: "telegram_hidden_intro";
  segment: AdminTelegramBroadcastSegment;
  text: string | null;
  photo_url: string | null;
  button_text: string | null;
  button_url: string | null;
  requested_limit: number;
  recipients: number;
  sent: number;
  blocked: number;
  failed: number;
  deleted: number;
  delete_failed: number;
  status: "sending" | "sent" | "partial" | "failed" | "deleting" | "deleted" | "delete_partial";
  created_at: string;
  completed_at: string | null;
  deleted_at: string | null;
};

export type AdminTelegramBroadcastHistory = {
  ok: boolean;
  broadcasts: AdminTelegramBroadcastRecord[];
};

export type AdminTelegramBroadcastDeleteResult = {
  ok: boolean;
  broadcast_id: string;
  total: number;
  deleted: number;
  failed: number;
  deleted_total: number;
  delete_failed_total: number;
  status: AdminTelegramBroadcastRecord["status"];
};

export type AdminTelegramPhotoUploadResult = {
  ok: boolean;
  url: string;
  token: string;
  content_type: "image/jpeg" | "image/png" | "image/webp";
  size_bytes: number;
};

export class AdminApiError extends Error {
  status: number;
  code: string;
  body: unknown;

  constructor(status: number, code: string, body?: unknown) {
    super(code);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

export async function fetchAdminTelegramStats(accessToken: string): Promise<AdminTelegramStats> {
  const res = await fetch("/api/admin/telegram-stats", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AdminApiError(res.status, typeof body?.error === "string" ? body.error : "admin_request_failed", body);
  }

  return body as AdminTelegramStats;
}

export async function sendAdminTelegramBroadcast(
  accessToken: string,
  input: AdminTelegramBroadcastRequest,
): Promise<AdminTelegramBroadcastResult> {
  const res = await fetch("/api/admin/telegram-broadcast", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AdminApiError(res.status, typeof body?.error === "string" ? body.error : "admin_request_failed", body);
  }

  return body as AdminTelegramBroadcastResult;
}

export async function fetchAdminTelegramBroadcasts(accessToken: string): Promise<AdminTelegramBroadcastHistory> {
  const res = await fetch("/api/admin/telegram-broadcasts?limit=20", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AdminApiError(res.status, typeof body?.error === "string" ? body.error : "admin_request_failed", body);
  }

  return body as AdminTelegramBroadcastHistory;
}

export async function deleteAdminTelegramBroadcast(
  accessToken: string,
  broadcastId: string,
): Promise<AdminTelegramBroadcastDeleteResult> {
  const res = await fetch("/api/admin/telegram-broadcasts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ action: "delete", broadcast_id: broadcastId }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AdminApiError(res.status, typeof body?.error === "string" ? body.error : "admin_request_failed", body);
  }

  return body as AdminTelegramBroadcastDeleteResult;
}

export async function uploadAdminTelegramPhoto(
  accessToken: string,
  input: {
    file_name: string;
    content_type: "image/jpeg" | "image/png" | "image/webp";
    data_base64: string;
  },
): Promise<AdminTelegramPhotoUploadResult> {
  const res = await fetch("/api/admin/telegram-upload-photo", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new AdminApiError(res.status, typeof body?.error === "string" ? body.error : "admin_request_failed", body);
  }

  return body as AdminTelegramPhotoUploadResult;
}
