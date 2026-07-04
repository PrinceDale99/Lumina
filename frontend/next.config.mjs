/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Prevent Webpack from following symlinks out of the frontend root
    // This allows it to resolve local linked packages using the frontend's node_modules
    config.resolve.symlinks = false;
    
    // Enable WebAssembly for the Midnight Zero-Knowledge runtime
    config.experiments = {
      ...config.experiments,
      syncWebAssembly: true,
    };
    
    // Explicitly flag .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/sync",
    });
    
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["lumina-circuits", "@midnight-ntwrk/compact-runtime"],
  },
};

export default nextConfig;
