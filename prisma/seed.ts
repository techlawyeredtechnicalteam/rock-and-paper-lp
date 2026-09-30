import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

async function main() {
	console.log("🌱 Starting database seed...");

	// --- 1. Seed Admin User ---
	const adminEmail = "admin@rockandpaperlp.com";
	const existingAdmin = await prisma.user.findUnique({
		where: { email: adminEmail },
	});

	if (!existingAdmin) {
		const hashedPassword = await bcrypt.hash("admin123", 12);
		await prisma.user.create({
			data: {
				email: adminEmail,
				fullName: "System Admin",
				password: hashedPassword,
				role: "ADMIN",
			},
		});
		console.log(`✅ Admin created (Email: ${adminEmail} | Password: admin123)`);
	} else {
		console.log("⏩ Admin user already exists. Skipping.");
	}

	console.log("🎉 Seeding complete!");
}

main().catch((e) => {
	console.error("❌ Seeding failed:", e);
	process.exit(1);
});
