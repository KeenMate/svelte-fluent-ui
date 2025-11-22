import {execSync} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Compile SCSS to CSS
try {
	execSync('npx sass dist/main.scss dist/main.css', {
		cwd: rootDir,
		stdio: 'inherit'
	});
	console.log('✓ SCSS compiled to CSS');
} catch (error) {
	console.error('Error compiling SCSS:', error.message);
	process.exit(1);
}
