import { IBucketStorageGateway } from '../Gateways/IBucketStorageGateway'

export class DownloadFolderImagesFromS3BucketUseCase {
  constructor(private imageRepository: IBucketStorageGateway) {}

  async execute(bucketName: string) {
    const folderToBeZipped = await this.imageRepository.getImages(bucketName)
    return folderToBeZipped.value.toString()
  }
}
