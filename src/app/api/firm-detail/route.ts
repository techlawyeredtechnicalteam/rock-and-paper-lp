import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Schema for updating/creating Firm Detail
const firmDetailSchema = yup.object({
	generalEmail: yup
		.string()
		.email("Must be a valid email")
		.required("General email is required"),
	partnerEmail: yup
		.string()
		.email("Must be a valid email")
		.required("Partner email is required"),
	phones: yup
		.array()
		.of(yup.string().required())
		.min(1, "At least one phone number is required")
		.required(),
	hours: yup.string().required("Operating hours are required"),
	xUrl: yup
		.string()
		.url("Must be a valid URL")
		.required("X (Twitter) URL is required"),
});

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// GET: Fetch the firm detail (Public)
export async function GET() {
	try {
		// We use findFirst because there should only ever be one record
		const settings = await prisma.firmDetail.findFirst();

		if (!settings) {
			// If it doesn't exist yet, return a 404 so the frontend knows to show an empty form
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ ok: true, data: settings }, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch firm detail:", error);
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}

// PUT: Update or Create the firm detail (Authenticated)
export async function PUT(req: NextRequest) {
	try {
		// --- Auth Check ---
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };
		// ------------------

		const body = await req.json();

		// Validate payload
		const data = await firmDetailSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		// Check if a record already exists
		const existingSettings = await prisma.firmDetail.findFirst();

		let settings;

		if (existingSettings) {
			// Update the existing record
			settings = await prisma.firmDetail.update({
				where: { id: existingSettings.id },
				data: {
					generalEmail: data.generalEmail,
					partnerEmail: data.partnerEmail,
					phones: data.phones,
					hours: data.hours,
					xUrl: data.xUrl,
				},
			});
		} else {
			// Create it if it doesn't exist yet
			settings = await prisma.firmDetail.create({
				data: {
					generalEmail: data.generalEmail,
					partnerEmail: data.partnerEmail,
					phones: data.phones,
					hours: data.hours,
					xUrl: data.xUrl,
				},
			});
		}

		return NextResponse.json({ ok: true, data: settings }, { status: 200 });
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
