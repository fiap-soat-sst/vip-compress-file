import { IBucketStorageGateway } from '../Gateways/IBucketStorageGateway'

export class UploadImagesToS3BucketUseCase {
  constructor(private readonly imageRepository: IBucketStorageGateway) {}
  async execute(compressedFolder: string) {
    return this.imageRepository.upload(
      compressedFolder,
      'compressed',
      'application/zip'
    )
  }
}
