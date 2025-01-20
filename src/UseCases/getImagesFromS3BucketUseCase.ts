import { S3BucketStorage } from '../Gateways/S3BucketStorage.ts'

export async function getImagesFromS3BucketUseCase(bucketName: string) {
  const s3BucketStorage = new S3BucketStorage()
  return s3BucketStorage.getImages(bucketName)
}
