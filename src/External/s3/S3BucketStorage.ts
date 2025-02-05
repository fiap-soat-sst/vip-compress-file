import { Either, Right, Left } from '../../@Shared/Either'
import { createReadStream, createWriteStream } from 'fs'
import { mkdir } from 'fs/promises'
import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'
import { IBucketStorageGateway } from '../../Gateways/IBucketStorageGateway'
import { fromEnv } from '@aws-sdk/credential-providers'
import { Readable, Stream } from 'stream'
import { Upload } from '@aws-sdk/lib-storage'

export class S3BucketStorage implements IBucketStorageGateway {
  client: S3Client
  constructor() {
    this.client = new S3Client({
      credentials: fromEnv(),
      region: process.env.AWS_REGION,
    })
  }
  async getProcessedImagesToCompact(
    folderKey: string,
    outputDir = `tozip/${folderKey}`
  ) {
    try {
      await mkdir(outputDir, { recursive: true })

      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.AWS_RAW_IMAGES_BUCKET,
        Prefix: folderKey,
      })
      const listResponse = await this.client.send(listCommand)

      if (!listResponse.Contents) {
        console.log('No files found in the specified folder.')
        return
      }

      for (const file of listResponse.Contents) {
        await this.downloadImage(file, outputDir)
      }

      return Right(outputDir)
    } catch (error) {
      console.error('Error downloading images:', error)
    }
  }

  async downloadImage(file: any, outputDir: string) {
    const fileKey = file.Key
    if (!fileKey) {
      console.log('No filesKey found')
      return
    }
    if (fileKey.endsWith('/')) {
      console.log('No filesKey found')
      return
    }

    console.log(`Downloading ${fileKey}...`)

    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_RAW_IMAGES_BUCKET,
      Key: fileKey,
    })

    const getResponse = await this.client.send(getCommand)
    const fileStream = getResponse.Body

    if (!(fileStream instanceof Readable)) {
      console.log(`Error: Unable to read file stream for ${fileKey}`)
      return
    }

    const fileName = fileKey.split('/').pop()
    const filePath = `${outputDir}/${fileName}`
    const writeStream = createWriteStream(filePath)

    fileStream.pipe(writeStream)
  }

  uploadZipToCompactedBucket(FolderToUpload: string) {
    return new Promise(async (resolve, reject) => {
      console.log('Uploading images to S3 bucket')
      const readableStream = createReadStream(`${FolderToUpload}.zip`)

      readableStream.on('error', (error) => {
        reject(error)
      })

      const pass = new Stream.PassThrough()
      try {
        const parallelUploads3 = new Upload({
          client: this.client,
          params: {
            Bucket: process.env.AWS_ZIP_IMAGES_BUCKET,
            Key: `${FolderToUpload}.zip`,
            Body: pass,
            ContentType: 'application/zip',
          },
        })
        readableStream.pipe(pass)
        await parallelUploads3.done()
        console.log('File uploaded successfully')
      } catch (error) {
        reject(Left<Error>(error as Error))
      }
    })
  }
}
