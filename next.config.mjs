import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  turbopack: {}, // Disable Turbopack (important for next-pwa)
};

export default withPWA(nextConfig);