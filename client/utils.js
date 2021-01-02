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
