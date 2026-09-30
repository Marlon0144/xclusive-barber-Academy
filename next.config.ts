import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Scoped to actual hosts in use only. Previously "**" (any HTTPS host),
    // which defeated the purpose of Next's remote image allowlist and
    // allowed the image optimizer to be used as an open proxy for
    // arbitrary URLs. Add new hostnames explicitly as they're needed.
    remotePatterns: [
      { protocol: "https", hostname: "xmyqswwitqlhrzznrscy.supabase.co" },
    ],
  },
  experimental: {
    serverActions: {
      // Límite elevado para permitir el upload de imágenes desde celular.
      // Los teléfonos modernos generan fotos de hasta ~10-12 MB;
      // con 16 MB cubrimos el archivo + el overhead de multipart/form-data.
      bodySizeLimit: "16mb",
    },
  },
};

export default nextConfig;
