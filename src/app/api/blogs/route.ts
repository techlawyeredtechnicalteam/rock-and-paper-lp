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
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// 1. Parse pagination params (default to page 1, 9 items per page)
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "9", 10);
		const skip = (page - 1) * limit;

		// 2. Filter logic (e.g., only show published posts if requested)
		const isPublic = searchParams.get("published") === "true";
		const where = isPublic ? { published: true } : {};

		// 3. Fetch data and total count concurrently for performance
		const [blogs, totalCount] = await Promise.all([
			prisma.blog.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: { creator: { select: { fullName: true } } },
			}),
			prisma.blog.count({ where }),
		]);

		// 4. Calculate total pages for the frontend pagination UI
		const totalPages = Math.ceil(totalCount / limit) || 1;

		return NextResponse.json(
			{
				ok: true,
				data: blogs,
				meta: {
					currentPage: page,
					totalPages,
					totalCount,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Failed to fetch blogs:", error);
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
