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
	const question = url.searchParams.get('question')?.trim().toLowerCase().replace(/\?$/, '');
	const object = url.searchParams.get('object');

	if (question == null || object == null) {
		return new Response('Missing parameters', { status: 400 });
	}

	try {
		const cachedResult = await pb
			.collection('cached_responses')
			.getFirstListItem(`question="${question}" && object="${object}"`);
		return new Response(cachedResult.response);
	} catch {
		const generatedAnswer = (
			await model.generateContent(`You are playing a game of "20 Questions" with the user. They will ask you yes or no questions about your object, and you must respond with "Yes" or "No". If you are unable to answer the question with a simple yes or no, respond with "Not Allowed". Do not include any text other than your answer to the question. The object is: "${url.searchParams.get('object')}".

The user has asked the question: "${url.searchParams.get('question')}"`)
		).response
			.text()
			.trim();

		pb.collection('cached_responses').create({
			question,
			object,
			response: generatedAnswer
		});

		return new Response(generatedAnswer);
	}
};
