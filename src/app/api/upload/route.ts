import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyToken } from "@/lib/auth";
import crypto from "crypto";

const s3 = new S3Client({
	region: "auto",
	endpoint: process.env.S3_ENDPOINT!,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
	},
});

const getUploadURL = async (key: string, contentType: string) => {
	const command = new PutObjectCommand({
		Bucket: process.env.S3_BUCKET!,
		Key: key,
		ContentType: contentType,
	});

	return await getSignedUrl(s3, command, { expiresIn: 120 });
};

export async function POST(req: NextRequest) {
	try {
		const token = req.cookies.get("admin_token")?.value;
		if (!token)
			return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

		const decoded = await verifyToken(token);
		if (!decoded)
			return NextResponse.json(
				{ message: "Invalid or expired session" },
				{ status: 401 }
			);

		const body = await req.json();
		if (!body.contentType)
			return NextResponse.json(
				{ message: "Content Type is required." },
				{ status: 400 }
			);

		const randomUUID = crypto.randomUUID().replace(/-/g, "").substring(0, 16);
		const fileExtension = body.contentType.split("/")[1];

		// The raw path where the file sits in R2
		const key = `website/images/${randomUUID}.${fileExtension}`;

		// Generate the presigned URL for the frontend PUT request
		const uploadUrl = await getUploadURL(key, body.contentType);

		// Construct the final public URL that will be saved to Prisma
		// We strip any trailing slashes from the env variable just in case
		const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
		const fileUrl = `${baseUrl}/${key}`;

		return NextResponse.json(
			{
				uploadUrl: uploadUrl, // The frontend PUTs the file here
				fileUrl: fileUrl, // The frontend sets this in Formik/state to save to DB
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("S3 Upload Error:", error);
		return NextResponse.json(
			{ message: "Internal Server Error", error: error.message },
			{ status: 500 }
		);
	}
}
