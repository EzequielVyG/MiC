import { MulterFile } from 'multer';
import * as Jimp from 'jimp';

const MAX_HEIGHT = 1080
const MAX_WIDTH = 1080

export class ImagesProcessorService {

    async resizeSingleImage(file: MulterFile): Promise<MulterFile> {

        if (!file.mimetype.startWith('image/')) {
            return file
        }

        const image = await Jimp.read(file.buffer);
        if (image.bitmap.height <= MAX_HEIGHT && image.bitmap.width <= MAX_WIDTH) {
            return file
        }

        if (image.bitmap.height > MAX_HEIGHT) {
            image.resize(Jimp.AUTO, MAX_HEIGHT);
        } else if (image.bitmap.width > MAX_WIDTH) {
            image.resize(MAX_WIDTH, Jimp.AUTO);
        }

        const resizedImageBuffer = await image.getBufferAsync(Jimp.AUTO as any);

        const resizedFile: MulterFile = {
            ...file,
            buffer: resizedImageBuffer,
            size: resizedImageBuffer.length,
        };

        return resizedFile;
    }

    async resizeMultiplesImages(files: MulterFile[]): Promise<MulterFile[]> {
        const resizedFiles: MulterFile[] = [];

        for (const file of files) {
            const resizedFile = await this.resizeSingleImage(file);
            resizedFiles.push(resizedFile);
        }

        return resizedFiles;
    }
}
