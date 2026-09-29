import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Schema for Experience creation and updates
export const experienceSchema = yup.object({
	value: yup.string().required("Value is required (e.g., US$100m)"),
	title: yup.string().required("Title is required"),
	description: yup.string().required("Description is required"),
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

// GET: Fetch all experiences (Public)
export async function GET() {
	try {
		const experiences = await prisma.experience.findMany({
			orderBy: { createdAt: "desc" }, // Often best to show newest entries first
		});

		return NextResponse.json({ ok: true, data: experiences }, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch experiences:", error);
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}

// POST: Create a new experience (Authenticated)
export async function POST(req: NextRequest) {
	try {
		// --- Auth Check ---
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };
		// ------------------

		const body = await req.json();

		const data = await experienceSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		const newExperience = await prisma.experience.create({
			data: {
				value: data.value,
				title: data.title,
				description: data.description,
				image: data.image,
				imageAlt: data.imageAlt,
			},
		});

		return NextResponse.json(
			{ ok: true, data: newExperience },
			{ status: 201 }
		);
	} catch (e: any) {
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
