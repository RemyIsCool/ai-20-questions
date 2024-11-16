import {
	GOOGLE_API_KEY,
	POCKETBASE_ADMIN_EMAIL,
	POCKETBASE_ADMIN_PASSWORD
} from '$env/static/private';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { RequestHandler } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
await pb.admins.authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASSWORD);

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

export const GET: RequestHandler = async ({ url }) => {
	const guess = url.searchParams.get('guess')?.trim().toLowerCase();
	const answer = url.searchParams.get('answer');

	if (guess == null || answer == null) {
		return new Response('Missing parameters', { status: 400 });
	}

	try {
		const cachedResult = await pb
			.collection('cached_guesses')
			.getFirstListItem(`answer="${answer}" && guess="${guess}"`);
		return new Response(cachedResult.correct.toString());
	} catch {
		const correct =
			(
				await model.generateContent(
					`Would most people consider these two things the same? Please only respond with "Yes" or "No": "${guess}" and "${answer}"`
				)
			).response
				.text()
				.trim() === 'Yes';

		pb.collection('cached_guesses').create({
			guess,
			answer,
			correct
		});

		return new Response(correct.toString());
	}
};
