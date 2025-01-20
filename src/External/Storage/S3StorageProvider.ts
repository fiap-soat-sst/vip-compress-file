import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Either, Left, Right } from '../../@Shared/Either'
import { IImageStorage } from '../../Gateways/Contracts/IImageStorage'

export default class S3StorageProvider implements IImageStorage {
  private s3: S3Client
  private bucketName: string

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
    })
    this.bucketName = process.env.AWS_S3_BUCKET || 'upload-videos-hackaton'
  }

  async getImages(bucketName: string): Promise<Either<Error, string>> {
    return Promise.resolve(Right('image'))
  }

  async upload(
    file: Buffer,
    key: string,
    contentType: string
  ): Promise<Either<Error, string>> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
    })

    try {
      await this.s3.send(command)

      const url = `https://${this.bucketName}.s3.amazonaws.com/${key}`

      return Right(url)
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }
}
