import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { practiceSchema } from "../route"; // Reuse the schema

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// PUT: Update a specific practice (Authenticated)
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// --- Auth Check ---
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };
		// ------------------

		const body = await req.json();

		const id = (await params).id;

		const data = await practiceSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		const updatedPractice = await prisma.practice.update({
			where: { id: id },
			data: {
				slug: data.slug,
				title: data.title,
				shortDescription: data.shortDescription,
				description: data.description,
				services: data.services,
				image: data.image,
				imageAlt: data.imageAlt,
			},
		});

		return NextResponse.json(
			{ ok: true, data: updatedPractice },
			{ status: 200 }
		);
	} catch (e: any) {
		if (e?.code === "P2025") {
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		}
		// Handle Prisma Unique Constraint Error in case they change the slug to one that already exists
		if (e?.code === "P2002") {
			return NextResponse.json(
				{
					ok: false,
					error: "CONFLICT",
					details: { slug: "This slug is already in use by another practice." },
				},
				{ status: 409 }
			);
		}
		if (e?.name === "ValidationError") {
			return NextResponse.json(
				{ ok: false, error: "VALIDATION_ERROR", details: yupErrorToDetails(e) },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ ok: false, error: e?.message || "SERVER_ERROR" },
			{ status: e?.status || 500 }
		);
	}
}

// DELETE: Remove a specific practice (Authenticated)
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// --- Auth Check ---
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };
		// ------------------

		const id = (await params).id;

		await prisma.practice.delete({
			where: { id },
		});

		return NextResponse.json(
			{ ok: true, message: "Practice deleted successfully" },
			{ status: 200 }
		);
	} catch (e: any) {
		if (e?.code === "P2025") {
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ ok: false, error: e?.message || "SERVER_ERROR" },
			{ status: e?.status || 500 }
		);
	}
}

// GET: Fetch a single practice by ID
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const id = (await params).id;
		const practice = await prisma.practice.findUnique({
			where: { slug: id },
		});

		if (!practice)
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		return NextResponse.json({ ok: true, data: practice }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}
