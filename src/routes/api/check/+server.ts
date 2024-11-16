import { GOOGLE_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { RequestHandler } from '@sveltejs/kit';

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

export const GET: RequestHandler = async ({ url }) => {
	const guess = url.searchParams.get('guess');
	const answer = url.searchParams.get('answer');

	if (guess == null || answer == null) {
		return new Response('Missing parameters', { status: 400 });
	}

	const correct =
		(
			await model.generateContent(
				`Would most people consider these two things the same? Please only respond with "Yes" or "No": "${guess}" and "${answer}"`
			)
		).response
			.text()
			.trim() === 'Yes';

	return new Response(correct.toString());
};
