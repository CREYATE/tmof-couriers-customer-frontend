// Stub Supabase client for development
export const supabase = {
  from: (...args: any[]) => ({
    select: (...args: any[]) => ({
      order: (...args: any[]) => ({
        eq: (...args: any[]) => ({
          single: () => ({ data: null, error: null }),
          limit: () => ({ data: [], error: null }),
          data: [],
          error: null,
        }),
        limit: (...args: any[]) => ({ data: [], error: null }),
        data: [],
        error: null,
      }),
      eq: (...args: any[]) => ({
        single: () => ({ data: null, error: null }),
        limit: () => ({ data: [], error: null }),
        data: [],
        error: null,
      }),
      data: [],
      error: null,
    }),
    data: [],
    error: null,
  }),
  rpc: (...args: any[]) => ({ data: null, error: null }),
};
