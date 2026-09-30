import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const pageSlug = searchParams.get("page");

		if (!pageSlug) {
			return NextResponse.json(
				{ error: "Page slug is required" },
				{ status: 400 }
			);
		}

		// Fetch all sections for this specific page
		const sections = await prisma.pageSection.findMany({
			where: { pageSlug },
		});

		return NextResponse.json({ data: sections }, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch page content:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request) {
	try {
		// Protect this route: ensure the admin is logged in
		const cookieStore = await cookies();
		const token = cookieStore.get("admin_token");
		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const {
			pageSlug,
			sectionKey,
			eyebrow,
			title,
			description,
			image,
			linkUrl,
			linkLabel,
		} = body;

		if (!pageSlug || !sectionKey) {
			return NextResponse.json(
				{ error: "pageSlug and sectionKey are required" },
				{ status: 400 }
			);
		}

		// Upsert creates it if it doesn't exist, or updates it if it does!
		const section = await prisma.pageSection.upsert({
			where: {
				pageSlug_sectionKey: { pageSlug, sectionKey },
			},
			update: {
				eyebrow,
				title,
				description,
				image,
				linkUrl,
				linkLabel,
			},
			create: {
				pageSlug,
				sectionKey,
				eyebrow,
				title,
				description,
				image,
				linkUrl,
				linkLabel,
			},
		});

		return NextResponse.json({ data: section }, { status: 200 });
	} catch (error) {
		console.error("Failed to update page section:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
