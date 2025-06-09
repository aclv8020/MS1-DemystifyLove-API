const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Enable JSON parsing
app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
   const allowedOrigins = [
       'https://dailyinspire.site',
       'https://purposetimer.com',
       'https://demystify.love'
   ];
   
   const origin = req.headers.origin;
   
    // TEMPORARY: Comment out this line to remove universal access
   res.header('Access-Control-Allow-Origin', '*');
   
   // // Check if origin is in allowed list OR ends with .websim.com
   // if (allowedOrigins.includes(origin) || (origin && origin.endsWith('.websim.com'))) {
   //     res.header('Access-Control-Allow-Origin', origin);
   // }
   
   // TO REMOVE WEBSIM ACCESS: Comment out the line above and uncomment the line below
   // if (allowedOrigins.includes(origin)) {
   //     res.header('Access-Control-Allow-Origin', origin);
   // }
   
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
    const voiceId = req.body.voiceId || 'CKoTcZ5xsqyRtfiK9aee'; // Replacew/ID (Def:  bIHbv24MWmeRgasZH58o, Brian: nPczCjzI2devNBz1zQrb, Mike Brit: CKoTcZ5xsqyRtfiK9aee, Mark Natural: UgBBYS2sOqTuMpoF3BR0, Granps:NOpBlnGInO9m6vDvFkFC)//
    const text = req.body.text;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        // const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        const response = await fetch(`https://api.elevenlabs.io//v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
            method: 'POST',
            headers: {
                'xi-api-key': elevenLabsApiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_turbo_v2_5", // Use Eleven Turbo V2.5 for lowest cost
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
