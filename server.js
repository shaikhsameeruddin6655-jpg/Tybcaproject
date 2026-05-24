// Express server setup
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Handle static assets first
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// API routes can be added here
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Handle page routes
app.get('/pages/:page', (req, res) => {
    const pageName = req.params.page;
    const pagePath = path.join(__dirname, '../frontend/pages', pageName);
    
    if (require('fs').existsSync(pagePath)) {
        res.sendFile(pagePath);
    } else {
        res.status(404).send('Page not found');
    }
});

// Catch-all handler - serve index.html for SPA routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
});
