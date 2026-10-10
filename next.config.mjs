/** Static export: the app is plain files on Cloudflare; data goes browser -> Supabase, protected by RLS. */
const nextConfig = {
  output: "export",
  trailingSlash: true,
};
export default nextConfig;
