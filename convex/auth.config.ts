// Clerk JWT issuer for Convex authentication.
// Set CLERK_JWT_ISSUER_DOMAIN in .env.local to your Clerk Frontend API URL.
// Found in Clerk Dashboard → API Keys → Frontend API (e.g. https://xxx.clerk.accounts.dev)
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
};
