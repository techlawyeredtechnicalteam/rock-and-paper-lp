import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { blogSchema } from "../route";

// GET: Fetch a single blog by ID
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const id = (await params).id;
		const blog = await prisma.blog.findUnique({
			where: { id },
		});

		if (!blog)
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		return NextResponse.json({ ok: true, data: blog }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}

// PUT: Update a specific blog
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };
		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid session", status: 401 };

		const id = (await params).id;
		const body = await req.json();

		const data = await blogSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		const updatedBlog = await prisma.blog.update({
			where: { id },
			data,
		});

		return NextResponse.json({ ok: true, data: updatedBlog }, { status: 200 });
	} catch (e: any) {
		if (e?.code === "P2025")
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		return NextResponse.json(
			{ ok: false, error: e?.message || "SERVER_ERROR" },
			{ status: e?.status || 500 }
		);
	}
}

// DELETE: Remove a specific blog
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };
		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid session", status: 401 };

		const id = (await params).id;

		await prisma.blog.delete({
			where: { id },
		});

		return NextResponse.json(
			{ ok: true, message: "Blog deleted" },
			{ status: 200 }
		);
	} catch (e: any) {
		if (e?.code === "P2025")
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		return NextResponse.json(
			{ ok: false, error: e?.message || "SERVER_ERROR" },
			{ status: e?.status || 500 }
		);
	}
}
