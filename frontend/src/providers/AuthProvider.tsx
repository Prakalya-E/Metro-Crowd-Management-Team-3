"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { createClient } from "@/lib/supabase/client";
import { getCurrentProfile } from "@/lib/api/auth";
import { isAuthDisabled, getMockEmail, clearMockEmail } from "@/lib/auth/mock";
import type { UserProfile } from "@/lib/api/types";

interface AuthContextValue {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const PROFILE_FETCH_BUDGET_MS = 120_000;

const PROFILE_FETCH_BACKOFF_MS = [800, 1500, 3000, 5000, 8000, 12000, 15000];

const OPTIMISTIC_CACHE_AFTER_MS = 4000;
const LAST_PROFILE_STORAGE_KEY = "metroflow:last-profile";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isAuthRejectionStatus(status: number | undefined) {
  return status === 401 || status === 403;
}

function readCachedProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function writeCachedProfile(profile: UserProfile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    
  }
}

function clearCachedProfile() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LAST_PROFILE_STORAGE_KEY);
  } catch {
    
  }
}

async function fetchProfileWithRetry(): Promise<
  { ok: true; profile: UserProfile } | { ok: false; authRejected: boolean; message: string }
> {
  const deadline = Date.now() + PROFILE_FETCH_BUDGET_MS;
  let lastMessage = "Could not verify your session.";
  let attempt = 0;

  while (true) {
    try {
      const profile = await getCurrentProfile();
      return { ok: true, profile };
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      lastMessage = err instanceof Error ? err.message : lastMessage;

      if (isAuthRejectionStatus(status)) {
        return { ok: false, authRejected: true, message: lastMessage };
      }

      const delay = PROFILE_FETCH_BACKOFF_MS[attempt] ?? PROFILE_FETCH_BACKOFF_MS[PROFILE_FETCH_BACKOFF_MS.length - 1];
      if (Date.now() + delay >= deadline) {
        return { ok: false, authRejected: false, message: lastMessage };
      }
      await sleep(delay);
      attempt += 1;
    }
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    let settled = false;
    let optimisticTimer: ReturnType<typeof setTimeout> | null = null;

    try {
      if (isAuthDisabled) {
        
        if (!getMockEmail()) {
          router.replace("/login");
          return;
        }
      } else {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            router.replace("/login");
            return;
          }
        }
      }

      const cached = readCachedProfile();
      if (cached) {
        optimisticTimer = setTimeout(() => {
          if (!settled) {
            setProfile(cached);
            setLoading(false);
          }
        }, OPTIMISTIC_CACHE_AFTER_MS);
      }

      const result = await fetchProfileWithRetry();
      settled = true;
      if (optimisticTimer) clearTimeout(optimisticTimer);

      if (result.ok) {
        setProfile(result.profile);
        setError(null);
        writeCachedProfile(result.profile);
      } else if (result.authRejected) {
        
        if (!isAuthDisabled) {
          const supabase = createClient();
          await supabase.auth.signOut();
        } else {
          clearMockEmail();
        }
        setProfile(null);
        clearCachedProfile();
        router.replace("/login");
        return;
      } else {
        
        setProfile((prev) => prev ?? cached);
        setError(result.message);
      }
    } catch (err) {
      settled = true;
      if (optimisticTimer) clearTimeout(optimisticTimer);
      setError(
        err instanceof Error ? err.message : "Could not verify your session.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    
  }, []);

  async function signOut() {
    if (isAuthDisabled) {
      clearMockEmail();
    } else {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setProfile(null);
    clearCachedProfile();
    router.replace("/login");
  }

  return (
    <AuthContext.Provider value={{ profile, loading, error, refresh: load, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}