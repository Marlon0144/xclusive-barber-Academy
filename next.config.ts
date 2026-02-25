import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
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
