import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const publicDir = path.join(rootDir, 'public');

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif'];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

console.log('Scanning for images...');

const srcFiles = getAllFiles(srcDir, []);
const publicFiles = fs.existsSync(publicDir) ? getAllFiles(publicDir, []) : [];
const allFiles = [...srcFiles, ...publicFiles];

const imageFiles = allFiles.filter(file => {
    return imageExtensions.includes(path.extname(file).toLowerCase());
});

const report = imageFiles.map(file => {
    const stats = fs.statSync(file);
    return {
        path: path.relative(rootDir, file),
        size: stats.size,
        formattedSize: formatBytes(stats.size)
    };
});

report.sort((a, b) => b.size - a.size);

console.log('\nImage Analysis Report:');
console.table(report);

if (report.length > 0) {
    console.log(`\nTotal Images: ${report.length}`);
    const totalSize = report.reduce((acc, curr) => acc + curr.size, 0);
    console.log(`Total Size: ${formatBytes(totalSize)}`);

    const largeImages = report.filter(img => img.size > 200 * 1024); // > 200KB
    if (largeImages.length > 0) {
        console.log(`\nWarning: ${largeImages.length} images are larger than 200KB. Consider optimizing:`);
        largeImages.forEach(img => console.log(`- ${img.path} (${img.formattedSize})`));
    }
} else {
    console.log('No images found.');
}
