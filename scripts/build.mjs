import * as esbuild from 'esbuild';
import { existsSync, readFileSync } from 'fs';

let adminPassword;
if (existsSync('.env.local')) {
  const envContent = readFileSync('.env.local', 'utf8');
  const match = envContent.match(/^ADMIN_PASSWORD=(.+)$/m);
  if (match) adminPassword = match[1].trim();
}

if (!adminPassword) {
  console.error('Missing admin password from .env.local file');
  process.exit(1);
}

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  format: 'esm',
  target: 'es2022',
  outfile: 'build/index.js',
  external: ['@chayns-codes/http'],
  platform: 'node',
  define: {
    'process.env.ADMIN_PASSWORD': JSON.stringify(adminPassword),
  },
});

console.log('Build complete → build/index.js');
