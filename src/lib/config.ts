export const appConfig = {
  name: 'Joint Command & War College Tracker',
  basePath: import.meta.env.BASE_URL,
  supabaseUrl: (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '',
  supabasePublishableKey: (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() ?? '',
}

export function hasSupabaseConfig(url: string | undefined, publishableKey: string | undefined): boolean {
  return Boolean(url?.trim() && publishableKey?.trim())
}

export const isSupabaseConfigured = hasSupabaseConfig(appConfig.supabaseUrl, appConfig.supabasePublishableKey)
