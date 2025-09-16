const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Google Gemini API endpoint
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

app.post('/api/generate', async (req, res) => {
    const { apiKey, platform, length, tone, customInput, targetAudience, keywords, cta } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'API key is required.' });
    }

    let prompt = `
        請你扮演一位專業的行銷文案專家。
        根據以下要求，生成一段行銷文案：
        - **目標平台:** ${platform}
    `;

    if (targetAudience) {
        prompt += `
- **目標受眾:** ${targetAudience}`;
    }

    prompt += `
- **文案長度:** ${length}`;
    prompt += `
- **文案語氣:** ${tone}`;

    if (keywords) {
        prompt += `
- **必須包含的關鍵字:** ${keywords}`;
    }
    
    if (cta) {
        prompt += `
- **行動呼籲 (CTA):** ${cta}`;
    }

    prompt += `
- **具體需求:** ${customInput}`;
    prompt += `

請直接生成文案內容，不要包含任何前言或標題。`;

    try {
        const response = await axios.post(`${API_URL}?key=${apiKey}`, {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.candidates && response.data.candidates.length > 0 && response.data.candidates[0].content.parts[0].text) {
            const generatedText = response.data.candidates[0].content.parts[0].text;
            res.json({ generatedText });
        } else {
            console.error('API response did not contain expected data.', response.data);
            res.status(500).json({ error: '從 API 未能成功生成內容。', details: response.data });
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: '呼叫 Gemini API 時發生錯誤。',
            details: error.response ? error.response.data : 'No response from server'
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
