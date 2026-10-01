import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const ADMIN_AUTH_PAGES = new Set(["/admin/login"]);

function isAdminPath(pathname: string) {
	return pathname === "/admin" || pathname.startsWith("/admin/");
}

// Named 'proxy' as per your required convention
export async function proxy(request: NextRequest) {
	const { pathname, search } = request.nextUrl;

	// ==========================================
	// 1. API ROUTE PROTECTION (The "CORS" Guard)
	// ==========================================
	if (pathname.startsWith("/api")) {
		// A. Modern Browser Check: Block cross-site fetch requests
		const fetchSite = request.headers.get("sec-fetch-site");
		if (fetchSite === "cross-site") {
			return new NextResponse(
				JSON.stringify({ error: "Cross-origin requests are forbidden." }),
				{ status: 403, headers: { "Content-Type": "application/json" } }
			);
		}

		// B. Strict Origin/Referer Check (Whitelist)
		const origin =
			request.headers.get("origin") || request.headers.get("referer");

		// Dynamically compute the alternate production domain (www vs non-www)
		const baseClientDomain = process.env.CLIENT_DOMAIN;
		const alternateClientDomain = baseClientDomain?.includes("://www.")
			? baseClientDomain.replace("://www.", "://")
			: baseClientDomain?.replace("://", "://www.");

		const allowedOrigins = [
			baseClientDomain,
			alternateClientDomain,
			"http://localhost:3000",
		];

		// If an origin exists and it's NOT in our whitelist, block it
		if (
			origin &&
			!allowedOrigins.some((allowed) => allowed && origin.startsWith(allowed))
		) {
			return new NextResponse(
				JSON.stringify({ error: "Origin not allowed." }),
				{ status: 403, headers: { "Content-Type": "application/json" } }
			);
		}

		// C. If it passes, allow the API request to proceed
		return NextResponse.next();
	}

	// ==========================================
	// 2. EXISTING PAGE & AUTH LOGIC
	// ==========================================

	// Skip static files and next internals
	if (pathname.includes(".")) {
		return NextResponse.next();
	}

	// -------- Admin flow --------
	if (isAdminPath(pathname) || ADMIN_AUTH_PAGES.has(pathname)) {
		// Edge-compatible Auth Check using jose
		const token = request.cookies.get("admin_token")?.value;
		let adminAuthed = false;

		if (token) {
			const decoded = await verifyToken(token);
			if (decoded) {
				adminAuthed = true;
			}
		}

		// If not authed and trying to access any admin page except login => send to login
		if (!adminAuthed && !ADMIN_AUTH_PAGES.has(pathname)) {
			const loginUrl = request.nextUrl.clone();
			loginUrl.pathname = "/admin/login";
			loginUrl.searchParams.set("next", pathname + search);
			return NextResponse.redirect(loginUrl);
		}

		// If authed and trying to access login => send to /admin/dashboard
		if (adminAuthed && ADMIN_AUTH_PAGES.has(pathname)) {
			const adminHome = request.nextUrl.clone();
			adminHome.pathname = "/admin/dashboard";
			adminHome.search = "";
			return NextResponse.redirect(adminHome);
		}

		return NextResponse.next();
	}

	return NextResponse.next();
}

// Apply to everything EXCEPT: next internals, and common metadata files
export const config = {
	matcher: ["/((?!_next|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"],
};
