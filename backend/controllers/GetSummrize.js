import { YoutubeTranscript } from "youtube-transcript"
import fs from "fs"
import FormData from "form-data"
import axios from "axios"
import path from "path"
import { fileURLToPath } from 'url';
import { exec } from "child_process";
import util from "util";

import { platform } from 'os';

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to yt-dlp binary (assuming it's in the backend root, one level up from controllers)
const isWindows = platform() === 'win32';
const binaryName = isWindows ? 'yt-dlp.exe' : 'yt-dlp';
const ytDlpPath = path.join(__dirname, '..', binaryName);

export const getSummrize = async (req, res) => {
    const { url } = req.body;

    try {
        let transcript = '';
        try {
            const data = await YoutubeTranscript.fetchTranscript(url);
            if (!data || data.length === 0) {
                throw new Error("Empty transcript");
            }
            transcript = data.map(t => t.text).join(' ');
        } catch (e) {
            console.log('Transcript unavailable or empty, falling back to audio via yt-dlp...', e.message);

            if (!fs.existsSync(ytDlpPath)) {
                throw new Error("yt-dlp.exe not found. Please run setup_ytdlp.js");
            }

            const timestamp = Date.now();
            const outputTemplate = path.join(__dirname, `temp_${timestamp}.%(ext)s`);

            // Download with yt-dlp
            // -f bestaudio: Get best quality audio
            // --no-playlist: Ensure single video
            // -o ...: Output template
            const command = `"${ytDlpPath}" -f bestaudio --no-playlist -o "${outputTemplate}" "${url}"`;

            console.log("Executing:", command);
            await execPromise(command);

            // Find the downloaded file
            const files = fs.readdirSync(__dirname);
            const audioFile = files.find(f => f.startsWith(`temp_${timestamp}`));

            if (!audioFile) {
                throw new Error("Audio download failed - no file created");
            }

            const audioPath = path.join(__dirname, audioFile);
            console.log("Audio downloaded to:", audioPath);

            // Transcribe
            try {
                const formData = new FormData();
                formData.append('file', fs.createReadStream(audioPath));
                formData.append('model', 'whisper-large-v3');

                const groqRes = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', formData, {
                    headers: {
                        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                        ...formData.getHeaders()
                    },
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity
                });

                transcript = groqRes.data.text;
            } finally {
                // Cleanup
                if (fs.existsSync(audioPath)) {
                    fs.unlinkSync(audioPath);
                }
            }
        }

        if (!transcript) {
            throw new Error("Could not generate transcript from video or audio.");
        }

        console.log("Transcript length:", transcript.length);

        // Summarize with Groq
        try {
            const summaryResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are an AI that summarizes YouTube videos. Provide a concise but comprehensive summary of the following transcript. Use bullet points for key takeaways."
                    },
                    {
                        role: "user",
                        content: transcript
                    }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const summary = summaryResponse.data.choices[0].message.content;

            res.status(200).json({
                message: "Success",
                summary
            });
        } catch (groqError) {
            console.error("Groq Error:", groqError?.response?.data || groqError.message);
            throw new Error(`Groq Summarization Failed: ${groqError?.response?.data?.error?.message || groqError.message}`);
        }

    } catch (error) {
        console.error(error?.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to generate summary. Ensure video is accessible.',
            details: error.message
        });
    }
}