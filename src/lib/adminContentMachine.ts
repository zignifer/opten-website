import { AdminApiError } from "./adminApi";

export type ContentMachineStage = {
  id: string;
  title: string;
  description: string;
  sourceFile: string;
  sourceUrl: string;
};

export type ContentMachinePipeline = {
  id: string;
  title: string;
  purpose: string;
  stages: ContentMachineStage[];
};

export type ContentMachineFormat = {
  id: string;
  title: string;
  styleFile: string;
  sourceHierarchy: string;
  navigation: string;
  finalGate: string;
  validatorMode: string;
  ctaPolicy: string;
  sourceUrl: string;
};

export type ContentMachineCreator = {
  priority: number;
  name: string;
  url: string;
  reason: string;
};

export type ContentMachineSkill = {
  name: string;
  description: string;
  path: string;
  sourceUrl: string;
};

export type ContentMachineMetricHistory = {
  date: string;
  youtubeSubscribers: number;
  instagramFollowers: number;
  telegramSubscribers: number;
  note: string;
};

export type ContentMachineTableRow = Record<string, string>;

export type ContentMachineSnapshot = {
  schemaVersion: number;
  generatedAt: string;
  source: { repository: string; branch: string; syncMode: string };
  freshness: {
    status: "fresh" | "warning";
    warnings: Array<{ code: string; severity: string; message: string }>;
    metricsSnapshotDate: string | null;
    metricsAgeDays: number | null;
    graphGeneratedAt: string | null;
  };
  overview: {
    formats: number;
    pipelines: number;
    skills: number;
    creators: number;
    graphNodes: number;
    graphEdges: number;
    positioning: {
      oneLiner: string;
      contentLines: ContentMachineTableRow[];
      tasks: ContentMachineTableRow[];
    };
  };
  pipelines: ContentMachinePipeline[];
  formats: ContentMachineFormat[];
  creators: ContentMachineCreator[];
  skills: ContentMachineSkill[];
  metrics: {
    snapshotDate: string | null;
    ageDays: number | null;
    status: string;
    latest: Record<string, string>;
    history: ContentMachineMetricHistory[];
    funnelComparison: ContentMachineTableRow[];
    telegramFunnel: ContentMachineTableRow[];
    contentPerformance: ContentMachineTableRow[];
    diagnosis: string;
    measurementGaps: string;
  };
  graph: {
    available: boolean;
    nodes: number;
    edges: number;
    communities: number;
    generatedAt: string | null;
    focusNodes: Array<{
      id: string;
      label: string;
      category: string;
      sourceFile: string;
      sourceLocation: string | null;
      community: string;
      degree: number;
    }>;
    focusLinks: Array<{ source: string; target: string; relation: string; confidence: string }>;
  };
  knowledgeDocuments: Array<{
    path: string;
    title: string;
    category: string;
    purpose: string;
    modifiedAt: string;
    sha256: string;
    sourceUrl: string;
    sections: Array<{ title: string; level: number; body: string }>;
  }>;
  cta: {
    ladder: ContentMachineTableRow[];
    byTask: ContentMachineTableRow[];
    sourceUrl: string;
  };
  sourceLibraries: {
    hookFormulas: number;
    hookFamilies: number;
    creatorWatchlistRule: string;
    formatLibrary: string;
  };
  privacy: {
    readOnly: boolean;
    containsPersonalData: boolean;
    excluded: string[];
  };
};

export async function fetchAdminContentMachine(accessToken: string): Promise<ContentMachineSnapshot> {
  const response = await fetch("/api/admin/content-machine", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new AdminApiError(
      response.status,
      typeof body?.error === "string" ? body.error : "content_machine_request_failed",
      body,
    );
  }
  return body as ContentMachineSnapshot;
}
