const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Enable JSON parsing
app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allows all origins like WebSim.ai -- Comment out when done testing and use below
    // res.header('Access-Control-Allow-Origin', 'https://demystify.love'); //add allowed domain(s)

    res.header('Access-Control-Allow-Headers', 'Content-Type'); // Allows Content-Type header
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Allows POST and preflight (OPTIONS) requests
    next();
});

// Handle preflight OPTIONS request (required for CORS)
app.options('/get-data', (req, res) => {
    res.sendStatus(200); // Respond to preflight with success
});

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
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
