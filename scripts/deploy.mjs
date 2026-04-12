import { readFileSync } from 'fs';

const username = process.env.CHAYNS_USERNAME;
const password = process.env.CHAYNS_PASSWORD;
const locationId = process.env.CHAYNS_LOCATION_ID;

if (!username || !password || !locationId) {
  console.error('Error: CHAYNS_USERNAME, CHAYNS_PASSWORD, and CHAYNS_LOCATION_ID must be set in .env.local');
  process.exit(1);
}

const authResponse = await fetch('https://auth.tobit.com/v2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  },
  body: JSON.stringify({ tokenType: 1, locationId: Number(locationId) }),
});

if (!authResponse.ok) {
  console.error(`Auth failed: ${authResponse.status} ${authResponse.statusText}`);
  process.exit(1);
}

const { token } = await authResponse.json();
console.log('Auth successful →', authResponse.status);

const codeId = process.env.CHAYNS_CODE_ID;
if (!codeId) {
  console.error('Error: CHAYNS_CODE_ID env var not set. Add it to .env.local');
  process.exit(1);
}

const source = readFileSync('build/index.js', 'utf-8');

const response = await fetch(
  `https://cube.tobit.cloud/chayns-codes-runtime/v1/codeversion/${codeId}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ source }),
  }
);

if (!response.ok) {
  console.error(`Deploy failed: ${response.status} ${response.statusText}`);
  process.exit(1);
}

console.log('Deploy successful →', response.status);
