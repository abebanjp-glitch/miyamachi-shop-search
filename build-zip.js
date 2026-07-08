import fs from 'fs';
import AdmZip from 'adm-zip';

try {
  console.log('Generating project ZIP for production build...');
  const zip = new AdmZip();
  zip.addLocalFolder('.', '', (filepath) => {
    const normalized = filepath.replace(/\\/g, '/');
    return !normalized.startsWith('node_modules') &&
           !normalized.startsWith('.git') &&
           !normalized.startsWith('dist') &&
           !normalized.endsWith('.zip') &&
           !normalized.endsWith('.tar.gz') &&
           normalized !== 'build-zip.js';
  });
  
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  
  zip.writeZip('public/project.zip');
  console.log('Project ZIP created successfully at public/project.zip!');
} catch (err) {
  console.error('Failed to generate project ZIP:', err);
  process.exit(1);
}
