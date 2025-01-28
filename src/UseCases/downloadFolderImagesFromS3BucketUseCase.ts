import { IBucketStorageGateway } from '../Gateways/IBucketStorageGateway'

export class DownloadFolderImagesFromS3BucketUseCase {
  constructor(private bucketStorageGateway: IBucketStorageGateway) {}

  async execute(bucketName: string) {
    console.log('Downloading folder images from S3 bucket')

    const folderToBeZipped =
      await this.bucketStorageGateway.getProcessedImagesToCompact(bucketName)

    return folderToBeZipped.value.toString()
  }
}
