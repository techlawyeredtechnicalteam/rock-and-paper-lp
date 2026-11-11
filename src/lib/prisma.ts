import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};

function getPrismaClient(): PrismaClient {
	if (globalForPrisma.prisma) {
		return globalForPrisma.prisma;
	}

	const adapter = new PrismaPg({
		connectionString: process.env.DATABASE_URL,
		// On Cloudflare Workers, TCP sockets cannot be reused across separate requests.
		// Setting maxUses: 1 ensures each connection is closed after use instead of staying idle across requests.
		maxUses: process.env.NODE_ENV === "production" ? 1 : undefined,
	});

	const client = new PrismaClient({ adapter });
	globalForPrisma.prisma = client;
	return client;
}

const prisma = new Proxy({} as PrismaClient, {
	get(_target, prop) {
		const client = getPrismaClient();
		const value = Reflect.get(client, prop, client);
		return typeof value === "function" ? value.bind(client) : value;
	},
});

export default prisma;

