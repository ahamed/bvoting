const cost = {
	voterRegistration: [
		127034,
		112034,
		112034,
		112034,
		112034,
		111970,
		112034,
		111970,
		112034,
		112034,
	],
	candidateRegistration: [152060, 137060, 136932, 136996],
	voteCast: [
		382606,
		382606,
		382606,
		382606,
		382606,
		382606,
		382606,
		382606,
		382606,
		382606,
	],
	voterCoinReductionCost: 28135,
	voteCountCost: 144472,
	deploymentCost: [614032, 579917, 734353],
};

const totalCost = data => {
	return Object.entries(data).reduce((acc, [key, value]) => {
		if (typeof value === 'object' && value instanceof Array) {
			let sum = value.reduce((a, c) => a + c);
			return acc + sum;
		} else {
			return acc + value;
		}
	}, 0);
};

// console.log(totalCost(cost));
console.table(cost.voterRegistration);
