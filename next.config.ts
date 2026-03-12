import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const remotePatterns: RemotePattern[] = [];

if (wordpressUrl) {
  const { protocol, hostname, port } = new URL(wordpressUrl);

  remotePatterns.push({
    protocol: protocol.replace(":", "") as "http" | "https",
    hostname,
    port,
    pathname: "/wp-content/uploads/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
