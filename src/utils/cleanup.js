const fs = require('fs-extra');
const path = require('path');

class CleanupService {
    static async cleanOldFiles() {
        const convertedDir = path.join(__dirname, '../../converted');
        const uploadsDir = path.join(__dirname, '../../uploads');
        const maxAge = 1000 * 60 * 60;

        try {
            const cleanDirectory = async (dir) => {
                const files = await fs.readdir(dir);
                const now = Date.now();

                for (const file of files) {
                    if (file === '.gitignore' || file === '.gitkeep') continue;
                    
                    const filePath = path.join(dir, file);
                    const stats = await fs.stat(filePath);
                    
                    if (now - stats.mtimeMs > maxAge) {
                        await fs.remove(filePath);
                        console.log(`Removed old file: ${file}`);
                    }
                }
            };

            await cleanDirectory(convertedDir);
            await cleanDirectory(uploadsDir);
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }
}

module.exports = CleanupService;
