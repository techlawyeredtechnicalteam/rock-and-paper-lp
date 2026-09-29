import { jwtVerify, SignJWT } from "jose";

const getJwtSecretKey = () => {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET environment variable is not set.");
	}
	return new TextEncoder().encode(secret);
};

export async function signToken(payload: { userId: string; role: string }) {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1d") // Token expires in 1 day
		.sign(getJwtSecretKey());
}

export async function verifyToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, getJwtSecretKey());
		return payload as { userId: string; role: string };
	} catch (error) {
		return null; // Invalid or expired token
	}
}
