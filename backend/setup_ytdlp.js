import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect platform
const isWindows = platform() === 'win32';
const binaryName = isWindows ? 'yt-dlp.exe' : 'yt-dlp';
const binaryUrl = isWindows
    ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
    : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp'; // Linux/Unix

const binaryPath = path.join(__dirname, binaryName);

async function downloadYtDlp() {
    console.log(`Downloading ${binaryName} for platform ${platform()}...`);
    const writer = fs.createWriteStream(binaryPath);

    try {
        const response = await axios({
            url: binaryUrl,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Set executable permissions on non-Windows
        if (!isWindows) {
            console.log("Setting executable permissions...");
            fs.chmodSync(binaryPath, '755');
        }

        console.log(`${binaryName} downloaded successfully.`);
    } catch (error) {
        console.error(`Error downloading ${binaryName}:`, error.message);
        process.exit(1);
    }
}

(async () => {
    await downloadYtDlp();
})();
