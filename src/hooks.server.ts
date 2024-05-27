//Code taken from https://supabase.com/docs/guides/auth/server-side/sveltekit

import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

import { GOOGLE_EMAIL } from "$env/static/private";
import transporter from "$lib/emailSetup.server.js";

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (!event.locals.session && event.url.pathname.startsWith('/private')) {
		return redirect(303, '/auth/login');
	}

	if (event.locals.session && event.url.pathname === '/auth/login') {
		return redirect(303, '/private');
	}

	return resolve(event);
};



// Create a Map to store cron jobs with unique identifiers
const cronJobs: Map<string, CronJob> = new Map();

import { CronJob } from 'cron';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getMedicinesFromSector } from '$lib/database';
import { clearCompartment } from '$lib/database';

export async function createJob (date: Date, sector: number, supabase: SupabaseClient) {
	console.log(`Creating job for sector ${sector} at ${date}`);
	if (cronJobs.has(`sector_${sector}`)) {
		cronJobs.get(`sector_${sector}`).stop();
	}
	const job = new CronJob(
		date, // cronTime
		async function () {
			const medList = await getMedicinesFromSector(sector, supabase);
			console.log(`Time to take ${medList}!`);
			await clearCompartment(sector, supabase);
			await createEmail(1, supabase, medList);
		}, // onTick
	);
	cronJobs.set(`sector_${sector}`, job);
	job.start();
	console.log('Cron jobs created', cronJobs);
}



export async function createEmail (type: number, supabase: SupabaseClient, medList: String[]) {
	try {
		const email = (await supabase.auth.getUser()).data.user?.email;

		// switch case type 1 2 3
		let subject = "";
		let body = "";
		switch (type) {
			case 1:
				subject = `[ALERT] Time to take your medicine!`;
				body = `Here are the medicines you have to take: ${medList.join(', ')}`;
				break;
			case 2:
				subject = "[REMINDER] No more set dispenses!";
				body = "You have no more set dispenses! Please refill your compartments to continue receiving reminders.";
				break;
			default:
				subject = "";
				body = "";
				break;
		}



		let html = `<h2>Hi!</h2><pre>${body}</pre>`;

		const message = {
			from: GOOGLE_EMAIL,
			to: email,
			subject: subject,
			text: body,
			html: html,
		};

		const sendEmail = async (message) => {
			await new Promise((resolve, reject) => {
				transporter.sendMail(message, (err, info) => {
					if (err) {
						console.error(err);
						reject(err);
					} else {
						resolve(info);
					}
				});
			});
		};

		await sendEmail(message);

		return {
			success: "Email is sent",
		};
	} catch (error) {
		console.error(error);
	}
}


// const job = new CronJob(
// 	'* * * * * *', // cronTime
// 	function () {
// 		console.log('You will see this message every second');
// 	}, // onTick
	
// );

export const handle: Handle = sequence(supabase, authGuard);
