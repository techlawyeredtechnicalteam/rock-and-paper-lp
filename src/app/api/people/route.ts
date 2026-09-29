import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Schema for Person creation and updates
export const personSchema = yup.object({
	slug: yup
		.string()
		.matches(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug must be lowercase letters, numbers, and hyphens only"
		)
		.required("Slug is required"),
	name: yup.string().required("Name is required"),
	expertise: yup
		.array()
		.of(yup.string().required("Expertise item cannot be empty"))
		.min(1, "At least one area of expertise is required")
		.required(),
	image: yup
		.string()
		.url("Must be a valid URL")
		.required("Image URL is required"),
	imagePosition: yup.string().nullable().optional(), // Nullable since it's an optional field
	bio: yup
		.array()
		.of(yup.string().required("Bio paragraph cannot be empty"))
		.min(1, "At least one bio paragraph is required")
		.required(),
});

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// GET: Fetch all people (Public)
export async function GET() {
	try {
		const people = await prisma.person.findMany({
			orderBy: { name: "asc" }, // Alphabetical order for team members
		});

		return NextResponse.json({ ok: true, data: people }, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch people:", error);
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}

// POST: Create a new person (Authenticated)
export async function POST(req: NextRequest) {
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

		const newPerson = await prisma.person.create({
			data: {
				slug: data.slug,
				name: data.name,
				expertise: data.expertise,
				image: data.image,
				imagePosition: data.imagePosition || null,
				bio: data.bio,
			},
		});

		return NextResponse.json({ ok: true, data: newPerson }, { status: 201 });
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
