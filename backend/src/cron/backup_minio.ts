import { google } from 'googleapis';
import { CronJob } from 'cron';
import { MinioService } from 'nestjs-minio-client';
import { MinioClientService } from '../minio-client/minio-client.service';
import { exec } from 'child_process';
import * as path from 'path';  // Importa el módulo path de Node.js
import * as moment from 'moment';

const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REDIRECT_URI = "";
const REFRESH_TOKEN = "";

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

// Obtener la fecha actual en el formato DD_MM_YYYY
const currentDate = moment().format('DD-MM-YYYY');

export function createDemon() {
    const job = new CronJob('0 4 * * *', async () => {
        try {
            await backupPostgres();

            const buckets = await getMinioClientService().listAllBuckets();

            for (const bucket of buckets) {
                const bucketName = bucket.name;

                // Subir individualmente los archivos dentro del bucket
                await uploadBucketToDrive(bucketName);
            }

            // Subir el archivo de postgres
            // Crear la estructura de carpetas en Google Drive
            const folderPath = `Backups/${currentDate}/postgres`;
            const folderId = await createFolderStructure(folderPath);

            const backupFileName = `${process.env.DATABASE_NAME}_(${currentDate}).sql`;
            const backupFilePath = path.resolve(__dirname, `../../../backups/${backupFileName}`);
            const backupFileStream = require('fs').createReadStream(backupFilePath);

            await uploadFile(backupFileName, backupFileStream, folderId);

        } catch (error) {
            console.error(`Error al realizar el respaldo de Minio: ${error.message}`);
        }
    });

    return job;
}

async function uploadBucketToDrive(bucketName) {
    try {
        // Crear la estructura de carpetas en Google Drive
        const folderPath = `Backups/${currentDate}/minio/${bucketName}`;
        const folderId = await createFolderStructure(folderPath);

        // Subir archivos individualmente a la carpeta en Google Drive
        const objectsList = await getMinioClientService().listAllObjects(bucketName);

        for (const obj of objectsList) {
            const objName = obj.name;
            const objStream = await getMinioClientService().client.getObject(bucketName, objName);

            await uploadFile(objName, objStream, folderId);
            console.log(`Archivo ${objName} subido a Google Drive en la carpeta ${folderPath}`);
        }

        console.log(`Bucket ${bucketName} respaldado en Google Drive en la carpeta ${folderPath}`);
    } catch (error) {
        console.log(error.message);
    }
}

async function uploadFile(name, file, folderId) {
    try {
        // Subir el archivo al directorio en Google Drive
        await drive.files.create({
            requestBody: {
                name: name,
                mimeType: 'image/jpg',
                parents: [folderId],
            },
            media: {
                mimeType: 'image/jpg',
                body: file,
            },
        });

        console.log(`Archivo ${name} subido a Google Drive en la carpeta con ID ${folderId}`);
    } catch (error) {
        console.log(error.message);
    }
}

async function createFolderStructure(folderPath) {
    const folders = folderPath.split('/');

    let currentFolderId = 'root';  // Establecer la carpeta raíz como padre inicial

    for (const folder of folders) {
        const existingFolder = await findFolderInParent(currentFolderId, folder);

        if (existingFolder) {
            currentFolderId = existingFolder.id;
        } else {
            const folderResponse = await drive.files.create({
                requestBody: {
                    name: folder,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [currentFolderId],
                },
            });

            currentFolderId = folderResponse.data.id;
        }
    }

    return currentFolderId;  // Devolver el ID de la última carpeta creada
}

async function findFolderInParent(parentId, folderName) {
    const response = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentId}' in parents`,
        fields: 'files(id)',
    });

    const files = response.data.files;

    if (files && files.length > 0) {
        return files[0];  // Devolver la primera carpeta encontrada (si hay alguna)
    }

    return null;  // No se encontró la carpeta
}

function getMinioClientService() {
    const minioService = new MinioService({
        endPoint: process.env.MINIO_ENDPOINT,
        port: parseInt(process.env.MINIO_PRIVATE_PORT),
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
        useSSL: false,
    });

    return new MinioClientService(minioService);
}

async function backupPostgres() {
    const dbName = process.env.DATABASE_NAME;
    const dbUser = process.env.DATABASE_USERNAME;
    const dbHost = process.env.DATABASE_HOST;
    const dbPort = process.env.DATABASE_PORT;
    const dbPassword = process.env.DATABASE_PASSWORD;

    const backupFileName = `${process.env.DATABASE_NAME}_(${currentDate}).sql`;
    const backupFilePath = path.resolve(__dirname, `../../../backups/${backupFileName}`);

    process.env.PGPASSWORD = dbPassword;

    const command = `pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -F c -b -v -f "${backupFilePath}" -w`;

    return new Promise<void>((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            delete process.env.PGPASSWORD;
            if (error) {
                console.error(`Error al realizar el respaldo: ${stderr}`);
                reject(error);
            } else {
                console.log(`Respaldo completado exitosamente. Archivo: ${backupFilePath}`);
                resolve();
            }
        });
    });
}
