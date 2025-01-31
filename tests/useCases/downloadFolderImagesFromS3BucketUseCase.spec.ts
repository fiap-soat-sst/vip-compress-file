// test/useCases/downloadFolderImagesFromS3BucketUseCase.spec.ts
import { DownloadFolderImagesFromS3BucketUseCase } from '../../src/UseCases/downloadFolderImagesFromS3BucketUseCase'
import { S3BucketStorage } from '../../src/External/s3/S3BucketStorage'
import { IBucketStorageGateway } from '../../src/Gateways/IBucketStorageGateway'

describe('downloadFolderImagesFromS3BucketUseCase', () => {
  let downloadFolderImagesFromS3BucketUseCase: DownloadFolderImagesFromS3BucketUseCase
  let bucketStorageGateway: IBucketStorageGateway

  beforeEach(() => {
    bucketStorageGateway = new S3BucketStorage()
    downloadFolderImagesFromS3BucketUseCase =
      new DownloadFolderImagesFromS3BucketUseCase(bucketStorageGateway)
  })

  it('should download folder images from S3 bucket', async () => {
    const bucketName = 'test-bucket'
    const result =
      await downloadFolderImagesFromS3BucketUseCase.execute(bucketName)
    expect(result).toBeDefined() // or expect(result).toBe('success message');
  })

  it('should throw an error if download fails', async () => {
    const bucketName = 'non-existent-bucket'
    await expect(
      downloadFolderImagesFromS3BucketUseCase.execute(bucketName)
    ).rejects.toThrowError()
  })

  it('should call getProcessedImagesToCompact method on bucketStorageGateway', async () => {
    const bucketName = 'test-bucket'
    const getProcessedImagesToCompactSpy = jest.spyOn(
      bucketStorageGateway,
      'getProcessedImagesToCompact'
    )
    await downloadFolderImagesFromS3BucketUseCase.execute(bucketName)
    expect(getProcessedImagesToCompactSpy).toHaveBeenCalledTimes(1)
    expect(getProcessedImagesToCompactSpy).toHaveBeenCalledWith(bucketName)
  })
})
