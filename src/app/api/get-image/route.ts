import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
	region: "auto",
	endpoint: process.env.S3_ENDPOINT!,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
	},
});

export async function GET(req: NextRequest) {
	try {
		const key = req.nextUrl.searchParams.get("key");

		if (!key) {
			return new NextResponse("Missing key", { status: 400 });
		}

		// Graceful Fallback: If the DB currently holds an old public HTTP URL (e.g., from our seed file)
		// just redirect straight to it so old data doesn't break.
		if (key.startsWith("http://") || key.startsWith("https://")) {
			return NextResponse.redirect(key);
		}

		const command = new GetObjectCommand({
			Bucket: process.env.S3_BUCKET!,
			Key: key,
		});

		// Generate a signed URL valid for 1 hour
		const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

		// Redirect the browser straight to the secure S3 URL
		return NextResponse.redirect(signedUrl);
	} catch (error) {
		console.error("S3 View Error:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
