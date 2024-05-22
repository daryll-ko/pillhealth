// Code taken from https://supabase.com/docs/guides/auth/server-side/sveltekit

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { session } }) => {
	return {
		session
	};
};
