import JWT, { JwtPayload } from "jsonwebtoken"
import { JWTData } from "src/Types/Types"

export function parseHeaderToUserData(headers: any): JWTData | null {
	try {
		const authToken = headers.authorization.split(' ')[1]
		const decoded = JWT.verify(authToken, process.env.JWT_SECRET_KEY || '') as JwtPayload
		const userData = decoded['data'] as JWTData || null
		return userData
	} catch (err) {
		console.log(`\x1B[31mToken Invalid or Expired ${err}\x1B[0m`)
		return null
	}
}


export function generatePassword(args: {
	length: number,
	minUppercase: number,
	minLowercase: number,
	minNumber: number,
	minSpecial: number,
}): string {
	// overload defaults with given options
	let { length, minUppercase, minLowercase, minNumber, minSpecial } = args

	const lowercase = !!minLowercase
	const uppercase = !!minUppercase
	const number = !!minNumber
	const special = !!minSpecial

	const minLength: number = minUppercase + minLowercase + minNumber + minSpecial;
	if (length < minLength) {
		length = minLength;
	}

	const positions: string[] = [];

	if (lowercase && minLowercase > 0) {
		for (let i = 0; i < minLowercase; i++) {
			positions.push("l");
		}
	}
	if (uppercase && minUppercase > 0) {
		for (let i = 0; i < minUppercase; i++) {
			positions.push("u");
		}
	}
	if (number && minNumber > 0) {
		for (let i = 0; i < minNumber; i++) {
			positions.push("n");
		}
	}
	if (special && minSpecial > 0) {
		for (let i = 0; i < minSpecial; i++) {
			positions.push("s");
		}
	}

	while (positions.length < length) {
		positions.push("a");
	}

	// shuffle
	shuffleArray(positions);

	// build out the char sets
	let allCharSet = "";

	let lowercaseCharSet = "abcdefghijkmnopqrstuvwxyz";
	if (lowercase) {
		allCharSet += lowercaseCharSet;
	}

	let uppercaseCharSet = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	if (uppercase) {
		allCharSet += uppercaseCharSet;
	}

	let numberCharSet = "23456789";
	if (number) {
		allCharSet += numberCharSet;
	}

	const specialCharSet = "!@#$%^&*";
	if (special) {
		allCharSet += specialCharSet;
	}

	let password = "";

	for (let i = 0; i < length; i++) {
		let positionChars: string = "";
		switch (positions[i]) {
			case "l":
				positionChars = lowercaseCharSet;
				break;
			case "u":
				positionChars = uppercaseCharSet;
				break;
			case "n":
				positionChars = numberCharSet;
				break;
			case "s":
				positionChars = specialCharSet;
				break;
			case "a":
				positionChars = allCharSet;
				break;
			default:
				break;
		}

		const randomCharIndex = Math.floor(Math.random() * (positionChars.length - 1));
		password += positionChars.charAt(randomCharIndex);
	}

	return password;
}

function shuffleArray(array: Array<string>) {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}
