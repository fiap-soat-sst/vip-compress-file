import { IBucketStorageGateway } from '../Gateways/IBucketStorageGateway'
import { Either, Left, Right } from '../@Shared/Either'

export class DownloadFolderImagesFromS3BucketUseCase {
  constructor(private bucketStorageGateway: IBucketStorageGateway) {}

  async execute(bucketName: string) {
    console.log('Downloading folder images from S3 bucket')
    try {
      const folderToBeZipped =
        await this.bucketStorageGateway.getProcessedImagesToCompact(bucketName)
      return Right(folderToBeZipped.value.toString())
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }
}
