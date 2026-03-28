import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude codepair reference folder from Next.js compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/codepair/**', '**/node_modules/**'],
    };
    return config;
  },
  // Exclude from page routing
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default withNextIntl(nextConfig);
