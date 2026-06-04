import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  fetchAccountSummary,
  readSession,
  refreshSessionIfNeeded,
  signOut as signOutSession,
  type AccountSummary,
  type OptenSession,
} from "../../../lib/optenAuth";

type SpaceAuthStatus = "loading" | "signed_out" | "signed_in" | "error";

type SpaceAuthContextValue = {
  status: SpaceAuthStatus;
  session: OptenSession | null;
  account: AccountSummary | null;
  error: string | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const SpaceAuthContext = createContext<SpaceAuthContextValue | null>(null);

export function SpaceAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SpaceAuthStatus>("loading");
  const [session, setSession] = useState<OptenSession | null>(null);
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const nextSession = await refreshSessionIfNeeded(readSession());
      if (!nextSession) {
        setSession(null);
        setAccount(null);
        setStatus("signed_out");
        return;
      }

      const nextAccount = await fetchAccountSummary(nextSession.access_token);
      setSession(nextSession);
      setAccount(nextAccount);
      setStatus("signed_in");
    } catch (err) {
      setSession(readSession());
      setAccount(null);
      setStatus("error");
      setError(err instanceof Error ? err.message : "account_summary_failed");
    }
  }, []);

  const signOut = useCallback(async () => {
    const token = session?.access_token;
    await signOutSession(token);
    setSession(null);
    setAccount(null);
    setError(null);
    setStatus("signed_out");
  }, [session?.access_token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ status, session, account, error, refresh, signOut }),
    [status, session, account, error, refresh, signOut],
  );

  return <SpaceAuthContext.Provider value={value}>{children}</SpaceAuthContext.Provider>;
}

export function useSpaceAuth(): SpaceAuthContextValue {
  const value = useContext(SpaceAuthContext);
  if (!value) throw new Error("useSpaceAuth must be used inside SpaceAuthProvider");
  return value;
}
