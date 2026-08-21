export type EditorialEvidenceKind = "source" | "guide";

export interface EditorialEvidenceLink {
  label: string;
  href: string;
  note: string;
  kind: EditorialEvidenceKind;
}
