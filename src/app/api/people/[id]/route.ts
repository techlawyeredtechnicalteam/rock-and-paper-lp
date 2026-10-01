import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { personSchema } from "../route"; // Reuse the schema

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// PUT: Update a specific person (Authenticated)
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

		const data = await personSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		const id = (await params).id;

		const updatedPerson = await prisma.person.update({
			where: { slug: id },
			data: {
				slug: data.slug,
				name: data.name,
				expertise: data.expertise,
				image: data.image,
				imagePosition: data.imagePosition || null,
				bio: data.bio,
			},
		});

		return NextResponse.json(
			{ ok: true, data: updatedPerson },
			{ status: 200 }
		);
	} catch (e: any) {
		if (e?.code === "P2025") {
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		}
		// Handle Prisma Unique Constraint Error if they change the slug to an existing one
		if (e?.code === "P2002") {
			return NextResponse.json(
				{
					ok: false,
					error: "CONFLICT",
					details: { slug: "This slug is already in use by another person." },
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

// DELETE: Remove a specific person (Authenticated)
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
		await prisma.person.delete({
			where: { id },
		});

		return NextResponse.json(
			{ ok: true, message: "Person deleted successfully" },
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

// GET: Fetch a single person by ID (Public/Admin)
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const id = (await params).id;
		const person = await prisma.person.findUnique({
			where: { id },
		});
		if (!person)
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		return NextResponse.json({ ok: true, data: person }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}
