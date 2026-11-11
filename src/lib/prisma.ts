import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};

function getPrismaClient(): PrismaClient {
	if (process.env.NODE_ENV !== "production" && globalForPrisma.prisma) {
		return globalForPrisma.prisma;
	}

	const adapter = new PrismaPg({
		connectionString: process.env.DATABASE_URL,
		// On Cloudflare Workers, TCP sockets and pg.Pool queues cannot be shared across separate requests.
		// Using max: 1 and maxUses: 1 per client ensures each connection is isolated to the current request and closed after use.
		...(process.env.NODE_ENV === "production"
			? { max: 1, maxUses: 1, idleTimeoutMillis: 1 }
			: {}),
	});

	const client = new PrismaClient({ adapter });

	if (process.env.NODE_ENV !== "production") {
		globalForPrisma.prisma = client;
	}

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

