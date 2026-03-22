import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const config = {
  serverExternalPackages: ['@takumi-rs/image-response'],
  reactStrictMode: true,
  output: 'export',
  distDir: 'out',
  // basePath: isGitHubPages ? '/clawvs' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // 允许从 Google Fonts 加载字体
    proxyTimeout: 10000,
  },
};

export default withMDX(config);
