import {execSync} from 'child_process';
import {copyFileSync} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(__dirname, '../../..');

// Copy README.md from workspace root to package
try {
	copyFileSync(
		path.join(workspaceRoot, 'README.md'),
		path.join(rootDir, 'README.md')
	);
	console.log('✓ README.md copied from workspace root');
} catch (error) {
	console.error('Error copying README.md:', error.message);
	process.exit(1);
}

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
