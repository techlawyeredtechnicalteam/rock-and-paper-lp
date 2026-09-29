import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Schema for Office creation and updates
export const officeSchema = yup.object({
	city: yup.string().required("City is required"),
	address: yup
		.array()
		.of(yup.string().required("Address line cannot be empty"))
		.min(1, "At least one address line is required")
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

// GET: Fetch all offices (Public)
export async function GET() {
	try {
		const offices = await prisma.office.findMany({
			orderBy: { createdAt: "asc" },
		});

		return NextResponse.json({ ok: true, data: offices }, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch offices:", error);
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}

// POST: Create a new office (Authenticated)
export async function POST(req: NextRequest) {
	try {
		// --- Auth Check ---
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };
		// ------------------

		const body = await req.json();

		const data = await officeSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		const newOffice = await prisma.office.create({
			data: {
				city: data.city,
				address: data.address,
				image: data.image,
				imageAlt: data.imageAlt,
			},
		});

		return NextResponse.json({ ok: true, data: newOffice }, { status: 201 });
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
