import { NextResponse } from "next/server";

export async function POST() {
	try {
		// 1. Create a successful response object
		const response = NextResponse.json(
			{ ok: true, message: "Logged out successfully" },
			{ status: 200 }
		);

		// 2. Delete the secure HTTP-only cookie
		response.cookies.delete("admin_token");

		// 3. Return the response to the client
		return response;
	} catch (error: any) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{ ok: false, error: "Failed to log out" },
			{ status: 500 }
		);
	}
}
