import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ‼️  COMPILE MESMO COM ERROS DE LINT E TYPESCRIPT
  eslint: {
    ignoreDuringBuilds: true,   // pula o ESLint no `next build`
  },
  typescript: {
    ignoreBuildErrors: true,    // permite concluir o build mesmo com erros de tipos
  },
};

export default nextConfig;
