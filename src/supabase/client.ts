import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

type StubChain = {
  then: (
    resolve: (v: { data: unknown[]; error: null }) => void,
  ) => Promise<{ data: unknown[]; error: null }>;
  eq: (column: string, value: unknown) => StubChain;
  neq: (column: string, value: unknown) => StubChain;
  order: (column: string, options?: { ascending?: boolean }) => StubChain;
  range: (from: number, to: number) => StubChain;
  in: (column: string, values: unknown[]) => StubChain;
  single: () => Promise<{ data: null; error: null }>;
  select: (columns?: string) => StubChain;
};

type StubBuilder = StubChain & {
  insert: (data: unknown) => StubBuilder;
  update: (data: unknown) => StubBuilder;
  delete: () => {
    eq: (column: string, value: unknown) => Promise<{ error: null }>;
  };
};

function createStub(): SupabaseClient {
  const chain = (): StubChain => ({
    then: (resolve) => {
      resolve({ data: [], error: null });
      return Promise.resolve({ data: [], error: null });
    },
    eq: () => chain(),
    neq: () => chain(),
    order: () => chain(),
    range: () => chain(),
    in: () => chain(),
    single: async () => ({ data: null, error: null }),
    select: () => chain(),
  });

  const builder = (): StubBuilder => ({
    ...chain(),
    select: () => chain(),
    insert: () => builder(),
    update: () => builder(),
    delete: () => ({ eq: async () => ({ error: null }) }),
  });

  const stub = {
    from: (_table: string) => builder(),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (
        _event: string,
        callback?: (event: string, session: null) => void,
      ) => {
        // Return unsubscribe function
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async (_credentials: {
        email: string;
        password: string;
      }) => ({
        data: { user: null, session: null },
        error: null,
      }),
      signUp: async (_credentials: { email: string; password: string }) => ({
        data: { user: null, session: null },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async (_email: string) => ({
        data: {},
        error: null,
      }),
      updateUser: async (_attributes: unknown) => ({
        data: { user: null },
        error: null,
      }),
    },
    storage: {
      from: (_bucket: string) => ({
        upload: async (_path: string, _file: File) => ({
          data: { path: "" },
          error: null,
        }),
        download: async (_path: string) => ({ data: null, error: null }),
        getPublicUrl: (_path: string) => ({ data: { publicUrl: "" } }),
        remove: async (_paths: string[]) => ({ data: [], error: null }),
        list: async (_path?: string) => ({ data: [], error: null }),
      }),
    },
    functions: {
      invoke: async (_functionName: string, _options?: unknown) => ({
        data: null,
        error: null,
      }),
    },
    realtime: {
      channel: (_name: string) => ({
        on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
        subscribe: () => ({ unsubscribe: () => {} }),
      }),
    },
    rpc: async (_fn: string, _params?: unknown) => ({
      data: null,
      error: null,
    }),
  };

  // Cast to SupabaseClient - the stub provides the essential methods
  // that the application uses, even if not all SupabaseClient methods are implemented
  return stub as unknown as SupabaseClient;
}

export const supabase: SupabaseClient =
  env.supabaseUrl && env.supabaseAnonKey
    ? createClient(env.supabaseUrl, env.supabaseAnonKey)
    : createStub();
