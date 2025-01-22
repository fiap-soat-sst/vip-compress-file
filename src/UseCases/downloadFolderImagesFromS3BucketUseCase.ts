import { S3BucketStorage } from '../External/s3/S3BucketStorage'

export async function downloadFolderImagesFromS3BucketUseCase(
  bucketName: string
) {
  const s3BucketStorage = new S3BucketStorage()
  const folderToBeZipped = await s3BucketStorage.getImages(bucketName)

  return folderToBeZipped.value.toString()
}
