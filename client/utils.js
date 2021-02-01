export const nodeBase = 'http://localhost:8080';
export const arrayBufferToHex = buffer => {
	return (
		'0x' +
		Array.prototype.map
			.call(new Uint8Array(buffer), x =>
				('00' + x.toString(16)).slice(-2)
			)
			.join('')
	);
};

export const inTime = () => {
	const ls = localStorage || window.localStorage;
	let start = ls.getItem('startDate') || false,
		end = ls.getItem('endDate') || false,
		now = new Date();

	if (!start || !end) return false;

	start = new Date(start.replace(/\s+/, 'T'));
	end = new Date(end.replace(/\s+/, 'T'));

	return now >= start && now <= end;
};
