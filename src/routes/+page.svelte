<script lang="ts">
	import { text } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	const topics = [
		'Pizza',
		'Smartphone',
		'Mountain',
		'Astronaut',
		'Giraffe',
		'Volcano',
		'Umbrella',
		'Ice cream',
		'Spaceship',
		'Robot',
		'Laptop',
		'Piano',
		'Ferris wheel',
		'Sunflower',
		'Chocolate',
		'Beach',
		'Firefighter',
		'Library',
		'Football',
		'Pirate',
		'Treasure',
		'Galaxy',
		'Kangaroo',
		'Snowman',
		'Telescope',
		'Submarine',
		'Microscope',
		'Dinosaur',
		'Bicycle',
		'Waterfall',
		'Detective',
		'Castle',
		'Turtle',
		'Chameleon',
		'Rainbow',
		'Unicorn',
		'Cave',
		'Meteor',
		'Ballet dancer',
		'Mermaid',
		'Genie',
		'Carpenter',
		'Bakery',
		'Dragon',
		'Fortress',
		'Safari',
		'Comic book',
		'Scuba diver',
		'Gladiator',
		'Library',
		'Greenhouse',
		'Cinema',
		'Arcade',
		'Train station',
		'Circus',
		'Alien',
		'Hot air balloon',
		'Zoo',
		'Opera singer',
		'Windmill',
		'Fossil',
		'Jungle',
		'Volleyball',
		'Surfer',
		'Archaeologist',
		'Spacesuit',
		'Banana',
		'Tiger',
		'Desert',
		'Sculptor',
		'Rock climbing',
		'Chess board',
		'Helicopter',
		'Wind turbine',
		'Trampoline',
		'Lighthouse',
		'Accordion',
		'Cave explorer',
		'Magician',
		'Roller coaster',
		'Candy shop',
		'Fireworks',
		'Water park',
		'Science lab',
		'Gymnast',
		'Blacksmith',
		'Orchestra',
		'Sailboat',
		'Popcorn',
		'Marathon runner',
		'Planetarium',
		'Clock tower',
		'Haunted house',
		'Astronomy',
		'Koala',
		'Medieval knight',
		'Comic strip',
		'Car race',
		'Wind chime',
		'Train conductor',
		'Soccer stadium',
		'Tea party',
		'Treasure map',
		'Hovercraft',
		'Space station',
		'Museum',
		'Carousel',
		'Fairy tale'
	];

	let object = 'Spacesuit';
	let question = $state('');
	let answerResponse: Promise<Response> | undefined = $state();

	const updateAnswer = (e: SubmitEvent) => {
		e.preventDefault();
		console.log(
			`/question?question=${encodeURIComponent(question)}&object=${encodeURIComponent(object)}`
		);
		answerResponse = fetch(
			`/question?question=${encodeURIComponent(question)}&object=${encodeURIComponent(object)}`
		);
	};

	function pickRandom<T>(array: Array<T>): T {
		return array[Math.floor(Math.random() * array.length)];
	}
</script>

<button onclick={() => (object = pickRandom(topics))}>New Game</button>
<form onsubmit={updateAnswer}>
	<input type="text" bind:value={question} />
</form>
Answer: {#await answerResponse then answer}
	{#await answer?.text() then answer}
		{answer}
	{/await}
{/await}
