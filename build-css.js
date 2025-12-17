import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tailwindPath = path.join(__dirname, 'node_modules', '.bin', 'tailwindcss');

try {
  const args = process.argv.slice(2);
  const cmd = `"${tailwindPath}" ${args.join(' ')}`;
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', shell: true });
} catch (error) {
  console.error('Error running tailwindcss:', error);
  process.exit(1);
}
