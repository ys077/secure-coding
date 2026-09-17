const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Buffer simulation API
app.post('/api/check-buffer', (req, res) => {
    const input = req.body.input || "";
    const BUFFER_SIZE = 8;
    const inputLength = input.length;
    
    if (inputLength > BUFFER_SIZE) {
        const excess = inputLength - BUFFER_SIZE;
        res.json({
            overflow: true,
            message: "SEGMENTATION FAULT",
            bufferSize: BUFFER_SIZE,
            inputLength: inputLength,
            excess: excess
        });
    } else {
        res.json({
            overflow: false,
            message: "Input is within buffer limit",
            bufferSize: BUFFER_SIZE,
            inputLength: inputLength,
            excess: 0
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
