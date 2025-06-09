const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Enable JSON parsing
app.use(express.json());

// CORS: Allow only specific websites
const allowedOrigins = [
    'https://demystify.love',
    'https://dailyinspire.site',
    'https://purposetimer.com',
    'https://websim.com'
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    next();
});

// Handle preflight OPTIONS requests
app.options('/get-data', (req, res) => res.sendStatus(200));
app.options('/get-tts', (req, res) => res.sendStatus(200));

// === MindStudio Route ===
app.post('/get-data', async (req, res) => {
    const apiKey = process.env.API_KEY;
    const apiUrl = 'https://api.mindstudio.ai/developer/v2/agents/run';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        if (!response.ok) {
            throw new Error(`MindStudio API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('MindStudio Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// === ElevenLabs TTS Route ===
app.post('/get-tts', async (req, res) => {
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = req.body.voiceId || 'your-default-voice-id'; // Replace with your preferred voice ID
    const text = req.body.text;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'xi-api-key': elevenLabsApiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`ElevenLabs API Error: ${response.status} ${response.statusText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        res.set('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(audioBuffer));
    } catch (error) {
        console.error('TTS Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
