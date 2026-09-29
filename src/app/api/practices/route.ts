import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Schema for Practice creation and updates
export const practiceSchema = yup.object({
	slug: yup
		.string()
		.matches(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug must be lowercase letters, numbers, and hyphens only"
		)
		.required("Slug is required"),
	title: yup.string().required("Title is required"),
	shortDescription: yup.string().required("Short description is required"),
	description: yup.string().required("Description is required"),
	services: yup
		.array()
		.of(yup.string().required("Service line cannot be empty"))
		.min(1, "At least one service is required")
		.required(),
	image: yup
		.string()
		.url("Must be a valid URL")
		.required("Image URL is required"),
	imageAlt: yup.string().required("Image alt text is required"),
});

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// GET: Fetch all practices (Public)
export async function GET() {
	try {
		const practices = await prisma.practice.findMany({
			orderBy: { title: "asc" }, // Alphabetical order makes sense for practice areas
		});

		return NextResponse.json({ ok: true, data: practices }, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch practices:", error);
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}

// POST: Create a new practice (Authenticated)
export async function POST(req: NextRequest) {
	try {
		// --- Auth Check ---
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };
		// ------------------

		const body = await req.json();

		const data = await practiceSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		const newPractice = await prisma.practice.create({
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

		return NextResponse.json({ ok: true, data: newPractice }, { status: 201 });
	} catch (e: any) {
		// Handle Prisma Unique Constraint Error for the slug
		if (e?.code === "P2002") {
			return NextResponse.json(
				{
					ok: false,
					error: "CONFLICT",
					details: { slug: "This slug is already in use." },
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
