const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const uploadRoutes = require('./routes/upload.routes');
const CleanupService = require('./utils/cleanup');

const app = express();
const port = 3000;

fs.ensureDirSync(path.join(__dirname, '../uploads'));
fs.ensureDirSync(path.join(__dirname, '../converted'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', uploadRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Video converter is running' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

setInterval(() => {
    CleanupService.cleanOldFiles();
}, 1000 * 60 * 60);

module.exports = app;
