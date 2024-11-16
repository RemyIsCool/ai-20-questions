import { GOOGLE_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { RequestHandler } from '@sveltejs/kit';

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

export const GET: RequestHandler = async ({ url }) => {
	const question = url.searchParams.get('question');
	const object = url.searchParams.get('object');

	if (question == null || object == null) {
		return new Response('Missing parameters', { status: 400 });
	}

	const generatedAnswer = (
		await model.generateContent(`You are playing a game of "20 Questions" with the user. They will ask you yes or no questions about your object, and you must respond with "Yes" or "No". If you are unable to answer the question with a simple yes or no, respond with "Not Allowed". Do not include any text other than your answer to the question. The object is: "${url.searchParams.get('object')}".

The user has asked the question: "${url.searchParams.get('question')}"`)
	).response
		.text()
		.trim();

	return new Response(generatedAnswer);
};
