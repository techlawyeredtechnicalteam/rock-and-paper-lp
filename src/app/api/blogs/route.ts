import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export const blogSchema = yup.object({
	title: yup.string().required("Title is required"),
	body: yup.string().required("Content body is required"),
	authorName: yup.string().required("Author name is required"),
	authorTitle: yup.string().nullable(),
	authorImage: yup.string().url("Must be a valid URL").nullable(),
	published: yup.boolean().default(false),
	image: yup
		.string()
		.url("Must be a valid URL")
		.required("Cover image is required"),
});

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// GET: Fetch all blogs
export async function GET() {
	try {
		const blogs = await prisma.blog.findMany({
			orderBy: { createdAt: "desc" },
			include: { creator: { select: { fullName: true } } }, // Bring in the admin's name
		});
		return NextResponse.json({ ok: true, data: blogs }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}

// POST: Create a new blog (Authenticated)
export async function POST(req: NextRequest) {
	try {
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = (await verifyToken(token)) as any;
		if (!decoded) throw { message: "Invalid session", status: 401 };

		const creatorId = decoded.id || decoded.userId; // Based on your JWT payload

		const body = await req.json();
		const data = await blogSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		const newBlog = await prisma.blog.create({
			data: {
				...data,
				creatorId, // Associate the blog with the logged-in admin
			},
		});

		return NextResponse.json({ ok: true, data: newBlog }, { status: 201 });
	} catch (e: any) {
		if (e?.name === "ValidationError")
			return NextResponse.json(
				{ ok: false, error: "VALIDATION_ERROR", details: yupErrorToDetails(e) },
				{ status: 400 }
			);
		return NextResponse.json(
			{ ok: false, error: e?.message || "SERVER_ERROR" },
			{ status: e?.status || 500 }
		);
	}
}
