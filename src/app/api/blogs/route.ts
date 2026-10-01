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
const generateSlug = (title: string) => {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "") // Remove non-word chars (except hyphens and spaces)
		.replace(/[\s_-]+/g, "-") // Swap spaces and underscores for hyphens
		.replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

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

		// 1. Generate the base slug
		let baseSlug = generateSlug(data.title);
		let slug = baseSlug;

		// 2. Ensure the slug is unique in the database
		let counter = 1;
		while (await prisma.blog.findUnique({ where: { slug } })) {
			slug = `${baseSlug}-${counter}`;
			counter++;
		}

		// 3. Save to database with the unique slug
		const newBlog = await prisma.blog.create({
			data: {
				...data,
				slug, // Pass the auto-generated slug here
				creatorId,
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
