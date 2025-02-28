import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { MulterFile } from 'multer'; // Import MulterFile type
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinioClientService {
    constructor(private readonly minio: MinioService) {
        this.logger = new Logger('MinioService');
    }

    private readonly logger: Logger;

    public get client() {
        return this.minio.client;
    }

    public async verifyBucket(bucketName: string, file: MulterFile) {
        try {
            const exists = await this.client.bucketExists(bucketName);
            if (!exists) {
                await this.client.makeBucket(bucketName);
                const policy = {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: {
                                AWS: ['*'],
                            },
                            Action: [
                                's3:ListBucketMultipartUploads',
                                's3:GetBucketLocation',
                                's3:ListBucket',
                            ],
                            Resource: [`arn:aws:s3:::${bucketName}`], // Change this according to your bucket name
                        },
                        {
                            Effect: 'Allow',
                            Principal: {
                                AWS: ['*'],
                            },
                            Action: [
                                's3:PutObject',
                                's3:AbortMultipartUpload',
                                's3:DeleteObject',
                                's3:GetObject',
                                's3:ListMultipartUploadParts',
                            ],
                            Resource: [`arn:aws:s3:::${bucketName}/*`], // Change this according to your bucket name
                        },
                    ],
                };

                this.client.setBucketPolicy(
                    bucketName,
                    JSON.stringify(policy),
                    function (err) {
                        if (err) throw err;
                    },
                );
                return await this.uploadFile(file, bucketName);
            } else {
                return await this.uploadFile(file, bucketName);
            }
        } catch (error) {
        }

    }

    public async uploadFile(file: MulterFile, bucketName: string) {
        try {
            const timestamp = Date.now().toString();
            const hashedFileName = crypto
                .createHash('md5')
                .update(timestamp)
                .digest('hex');
            const extension = file.originalname.substring(
                file.originalname.lastIndexOf('.'),
                file.originalname.length,
            );
            const metaData = {
                'Content-Type': file.mimetype,
            };

            // We need to append the extension at the end otherwise Minio will save it as a generic file
            const fileName = hashedFileName + extension;

            await this.client.putObject(
                bucketName,
                fileName,
                file.buffer,
                metaData
            );

            const url = `${process.env.MINIO_ACCESSPOINT}:${process.env.MINIO_PUBLIC_PORT}/${bucketName}/${fileName}`
            return url;

        } catch (error) {
        }
    }

    async removeFile(objetName: string, bucketName: string) {
        this.client.removeObject(bucketName, objetName);
    }

    // Función para vaciar un bucket (eliminar todos los objetos en el bucket)
    async emptyBucket(bucketName: string) {
        try {
            // Verificar si el bucket existe antes de intentar vaciarlo
            const bucketExists = await this.client.bucketExists(bucketName);

            if (!bucketExists) {
                return; // Salir de la función si el bucket no existe
            }

            const objectsList = await this.listAllObjects(bucketName);

            for (const obj of objectsList) {
                await this.client.removeObject(bucketName, obj.name);
            }

        } catch (error) {
            console.error(`Error al vaciar el bucket ${bucketName}:`, error);
        }
    }

    // Función auxiliar para listar todos los objetos en el bucket
    async listAllObjects(bucketName: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            const objectsList: any[] = [];

            this.client
                .listObjects(bucketName, '', true)
                .on('data', (obj) => {
                    objectsList.push(obj);
                })
                .on('error', (err) => {
                    reject(err);
                })
                .on('end', () => {
                    resolve(objectsList);
                });
        });
    }

    // Función auxiliar para listar todos los buckets
    async listAllBuckets() {
        const buckets = await this.client.listBuckets()
        return buckets
    }
}