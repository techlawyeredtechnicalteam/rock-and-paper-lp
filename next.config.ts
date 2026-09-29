import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		formats: ["image/avif", "image/webp"],
		qualities: [75, 95],
		remotePatterns: [
			{
				hostname: "pub-f8a339a8aa164543b809e058898a5b6b.r2.dev",
				protocol: "https",
			},
		],
	},
};

export default nextConfig;
