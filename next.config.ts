import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "i.imgur.com",
			},
		],
	},
	allowedDevOrigins: [
		"192.168.1.127",
		"192.168.8.111",
		"172.20.10.3",
		"10.62.102.137",
	],
};

export default nextConfig;
