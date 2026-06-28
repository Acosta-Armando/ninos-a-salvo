import type { NextConfig } from "next";

function getSupabaseHostname(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return "*.supabase.co";
  try {
    return new URL(url).hostname;
  } catch {
    return "*.supabase.co";
  }
}

const bucketType = process.env.NEXT_PUBLIC_BUCKET_TYPE ?? "public";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: getSupabaseHostname(),
        pathname: `/storage/v1/object/${bucketType}/**`,
      },
    ],
  },
};

export default nextConfig;
