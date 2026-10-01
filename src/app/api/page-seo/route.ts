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

		const seo = await prisma.pageSeo.findUnique({
			where: { pageSlug },
		});

		return NextResponse.json({ data: seo }, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch page SEO:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("admin_token");
		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { pageSlug, title, description, ogImage } = body;

		if (!pageSlug) {
			return NextResponse.json(
				{ error: "pageSlug is required" },
				{ status: 400 }
			);
		}

		const seo = await prisma.pageSeo.upsert({
			where: { pageSlug },
			update: {
				title,
				description,
				ogImage,
			},
			create: {
				pageSlug,
				title,
				description,
				ogImage,
			},
		});

		return NextResponse.json({ data: seo }, { status: 200 });
	} catch (error) {
		console.error("Failed to update page SEO:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
