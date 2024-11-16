<script lang="ts">
	import topics from '$lib/topics.json';

	let object = $state('');
	let question = $state('');
	let answer = $state('');
	let guess = $state('');
	let correct: boolean | null | undefined = $state();

	function newGame() {
		object = pickRandom(topics);
		correct = null;
		answer = '';
	}

	async function updateAnswer(e: SubmitEvent) {
		e.preventDefault();
		answer = await (
			await fetch(
				`/api/question?question=${encodeURIComponent(question)}&object=${encodeURIComponent(object)}`
			)
		).text();
	}

	async function checkAnswer(e: SubmitEvent) {
		e.preventDefault();
		correct =
			guess === object ||
			(await (
				await fetch(
					`/api/check?guess=${encodeURIComponent(guess)}&answer=${encodeURIComponent(object)}`
				)
			).text()) === 'true';
	}

	function pickRandom<T>(array: Array<T>): T {
		return array[Math.floor(Math.random() * array.length)];
	}
</script>

{object}

<button onclick={newGame}>New Game</button>

<form onsubmit={updateAnswer}>
	<label>
		Question:
		<input type="text" bind:value={question} />
	</label>
</form>

Answer: {answer}

<form onsubmit={checkAnswer}>
	<label>
		Guess:
		<input type="text" bind:value={guess} />
	</label>
</form>

Correct: {correct}
