import { createClient } from '@supabase/supabase-js';

export function createSupabaseClient() {
	const supabaseUrl =
		(import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
		(import.meta.env.PUBLIC_SUPABASE_URL as string | undefined);
	const supabaseAnonKey =
		(import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
		(import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined);

	if (!supabaseUrl || !supabaseAnonKey) {
		return {
			supabase: null,
			configured: false,
		};
	}

	return {
		supabase: createClient(supabaseUrl, supabaseAnonKey),
		configured: true,
	};
}