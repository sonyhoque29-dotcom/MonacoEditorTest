const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

const app = express();
const PORT = 3001;

app.use(cors());

// Ensure files directory exists
const FILES_DIR = path.join(__dirname, 'files');
if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR);
}

// 1. GENERATE BIG FILE (Helper endpoint)
app.post('/generate-big-json', (req, res) => {
    const filePath = path.join(FILES_DIR, 'big-data.json');
    const stream = fs.createWriteStream(filePath);

    stream.write('[\n');
    const TOTAL_ITEMS = 100000;

    let i = 0;
    function write() {
        let ok = true;
        do {
            i++;
            const item = JSON.stringify({
                id: i,
                name: `Item ${i}`,
                description: `This is a description for item ${i} to make the file larger.`,
                timestamp: new Date().toISOString()
            });
            const suffix = i === TOTAL_ITEMS ? '\n' : ',\n';

            if (i === TOTAL_ITEMS) {
                stream.write(item + suffix);
                stream.write(']');
                stream.end();
            } else {
                ok = stream.write(item + suffix);
            }
        } while (i < TOTAL_ITEMS && ok);

        if (i < TOTAL_ITEMS) {
            stream.once('drain', write);
        }
    }
    write();

    stream.on('finish', () => {
        res.json({ message: 'Big file generated', path: filePath });
    });
});

// 2. READ API (SSR Simulation - Streaming response)
app.get('/file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(FILES_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': fileSize
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
});

// 3. INSERT API (Streaming Write/Save)
// This endpoint streams the request body directly to the file
app.post('/file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(FILES_DIR, filename);

    // Create write stream
    const writeStream = fs.createWriteStream(filePath);

    // Pipe request to file
    req.pipe(writeStream);

    writeStream.on('finish', () => {
        res.json({ success: true, message: 'File saved successfully via stream' });
    });

    writeStream.on('error', (err) => {
        console.error('Write error:', err);
        res.status(500).json({ error: 'Failed to write file' });
    });
});

app.listen(PORT, () => {
    console.log(`File Server running on http://localhost:${PORT}`);
});
