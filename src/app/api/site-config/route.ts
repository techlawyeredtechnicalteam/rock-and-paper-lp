import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Schema for updating/creating Site Configuration
const siteConfigSchema = yup.object({
	name: yup.string().required("Site name is required"),
	shortName: yup.string().required("Short name is required"),
	url: yup.string().url("Must be a valid URL").required("Site URL is required"),
	locale: yup.string().required("Locale is required (e.g., en_NG)"),
	description: yup.string().required("Site description is required"),
	socialDescription: yup
		.string()
		.required("Social sharing description is required"),
	ogImage: yup.string().required("Open Graph image URL is required"),
	twitterImage: yup.string().required("Twitter image URL is required"),
});

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// GET: Fetch the site configuration
export async function GET() {
	try {
		// We use findFirst because this is a singleton
		const config = await prisma.siteConfig.findFirst();

		if (!config) {
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ ok: true, data: config }, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch site config:", error);
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}

// PUT: Update or Create the site configuration (Authenticated)
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
		const data = await siteConfigSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		// Check if a record already exists
		const existingConfig = await prisma.siteConfig.findFirst();

		let config;

		if (existingConfig) {
			// Update the existing record
			config = await prisma.siteConfig.update({
				where: { id: existingConfig.id },
				data: {
					name: data.name,
					shortName: data.shortName,
					url: data.url,
					locale: data.locale,
					description: data.description,
					socialDescription: data.socialDescription,
					ogImage: data.ogImage,
					twitterImage: data.twitterImage,
				},
			});
		} else {
			// Create it if it doesn't exist yet
			config = await prisma.siteConfig.create({
				data: {
					name: data.name,
					shortName: data.shortName,
					url: data.url,
					locale: data.locale,
					description: data.description,
					socialDescription: data.socialDescription,
					ogImage: data.ogImage,
					twitterImage: data.twitterImage,
				},
			});
		}

		return NextResponse.json({ ok: true, data: config }, { status: 200 });
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
