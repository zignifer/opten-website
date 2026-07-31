export const MAX_SNAPSHOT_BYTES = 1_000_000;

const forbiddenKeys = [
  "telegram_admin_secret",
  "service_role",
  "payment_id",
  "chat_id",
  "user_id",
  "access_token",
  "refresh_token",
];

export function validateContentMachineSnapshot(snapshot, encoded) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) {
    throw new Error("Content-machine snapshot must be an object.");
  }
  if (snapshot.schemaVersion !== 1) {
    throw new Error(`Unsupported content-machine schema: ${snapshot.schemaVersion}`);
  }
  if (snapshot.privacy?.readOnly !== true || snapshot.privacy?.containsPersonalData !== false) {
    throw new Error("Snapshot must declare the read-only, no-personal-data contract.");
  }
  if (!Array.isArray(snapshot.pipelines) || snapshot.pipelines.length < 5) {
    throw new Error("Snapshot must contain the canonical content pipelines.");
  }
  if (!Array.isArray(snapshot.formats) || snapshot.formats.length < 4) {
    throw new Error("Snapshot must contain the supported formats.");
  }
  if (!snapshot.graph || typeof snapshot.graph.nodes !== "number") {
    throw new Error("Snapshot must contain the Graphify summary.");
  }

  const bytes = Buffer.byteLength(encoded, "utf8");
  if (bytes > MAX_SNAPSHOT_BYTES) {
    throw new Error(`Snapshot is too large: ${bytes} bytes.`);
  }

  const lower = encoded.toLowerCase();
  for (const key of forbiddenKeys) {
    if (lower.includes(key)) throw new Error(`Snapshot contains forbidden key: ${key}`);
  }

  return { bytes };
}
