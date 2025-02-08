const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const EventEmitter = require('events');
const fs = require('fs-extra');

class ConversionEmitter extends EventEmitter {}
const conversionEmitter = new ConversionEmitter();

class VideoConverter {
    static getEmitter() {
        return conversionEmitter;
    }

    static async convertToMp4(inputPath, outputFileName) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(inputPath)) {
                reject(new Error('Input file not found'));
                return;
            }

            const outputPath = path.join('converted', outputFileName);
            let lastProgress = 0;
            
            ffmpeg(inputPath)
                .toFormat('mp4')
                .on('start', (commandLine) => {
                    console.log('Input file path:', inputPath);
                    console.log('Started conversion:', commandLine);
                })
                .on('progress', (progress) => {
                    const percent = Math.round(progress.percent);
                    if (percent !== lastProgress) {
                        lastProgress = percent;
                        conversionEmitter.emit('progress', {
                            filename: outputFileName,
                            percent: percent,
                            timemark: progress.timemark
                        });
                    }
                })
                .on('end', async () => {
                    conversionEmitter.emit('progress', {
                        filename: outputFileName,
                        percent: 100,
                        timemark: '100%'
                    });
                    try {
                        if (fs.existsSync(outputPath)) {
                            await fs.remove(inputPath);
                            resolve(outputPath);
                        } else {
                            reject(new Error('Conversion failed: Output file not created'));
                        }
                    } catch (error) {
                        reject(new Error(`Post-conversion error: ${error.message}`));
                    }
                })
                .on('error', (err) => {
                    let errorMessage = 'Conversion failed';
                    if (err.message.includes('Invalid data found')) {
                        errorMessage = 'Invalid video file format';
                    } else if (err.message.includes('No space left')) {
                        errorMessage = 'Not enough disk space';
                    } else if (err.message.includes('Permission denied')) {
                        errorMessage = 'Permission denied to access file';
                    }
                    reject(new Error(`${errorMessage}: ${err.message}`));
                })
                .save(outputPath);
        });
    }
}

module.exports = VideoConverter;
