import { existsSync } from 'fs';
import { resolve } from 'path';

const requiredRoutes = ['Home.tsx', 'RosterUpload.tsx', 'Standards.tsx', 'Assignments.tsx'];

const missing = requiredRoutes.filter((file) => !existsSync(resolve('src/pages', file)));

if (missing.length > 0) {
  console.error('Missing required route files:', missing.join(', '));
  process.exit(1);
}

console.log('All required route files are present.');
