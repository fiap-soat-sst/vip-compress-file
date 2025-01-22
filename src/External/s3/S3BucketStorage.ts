import { Either, Right, Left } from '../../@Shared/Either'
import { createWriteStream } from 'fs'
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { IBucketStorageGateway } from '../../Gateways/IBucketStorageGateway'

export class S3BucketStorage implements IBucketStorageGateway {
  private client: S3Client
  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
    })
  }
  async getImages(folderKey: string): Promise<Either<Error, string>> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: folderKey,
    }

    try {
      const command = new GetObjectCommand(params)
      const response = await this.client.send(command)
      const fileStream = createWriteStream(`tozip/${folderKey}`)
      fileStream.write(response)

      return Right(`tozip/${folderKey}`)
    } catch (error) {
      throw error
    }
  }
  async upload(
    file: Buffer,
    key: string,
    contentType: string
  ): Promise<Either<Error, string>> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file,
    }
    const command = new PutObjectCommand(params)

    try {
      await this.client.send(command)
      const url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`

      return Right(url)
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }
}
