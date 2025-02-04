// test/useCases/uploadImagesToS3BucketUseCase.spec.ts
import { UploadImagesToS3BucketUseCase } from '../../src/UseCases/uploadImagesToS3BucketUseCase'
import { S3BucketStorage } from '../../src/External/s3/S3BucketStorage'
import { setupMocks } from '../mocks/S3BucketStorage.mock'
import { IBucketStorageGateway } from '../../src/Gateways/IBucketStorageGateway'
import { vi } from 'vitest'

describe('uploadImagesToS3BucketUseCase', () => {
  beforeAll(async () => {
    setupMocks()
    bucketStorageGateway = new S3BucketStorage()
    uploadImagesToS3BucketUseCase = new UploadImagesToS3BucketUseCase(
      bucketStorageGateway
    )
  })

  let uploadImagesToS3BucketUseCase: UploadImagesToS3BucketUseCase
  let bucketStorageGateway: IBucketStorageGateway

  it('should upload images to S3 bucket', async () => {
    const localZipFolder = 'tozip/mnetc'
    const result = await uploadImagesToS3BucketUseCase.execute(localZipFolder)
    expect(result?.value).toBeUndefined()
  })

  it('should throw an error if upload fails', async () => {
    const localZipFolder = 'path/to/non-existent'
    const result = await uploadImagesToS3BucketUseCase.execute(localZipFolder)
    expect(result?.value).toBeInstanceOf(Error)
  })

  it('should call uploadZipToCompactedBucket method on bucketStorageGateway', async () => {
    const localZipFolder = 'tozip/mnetc'
    const uploadZipToCompactedBucketSpy = vi.spyOn(
      bucketStorageGateway,
      'uploadZipToCompactedBucket'
    )
    await uploadImagesToS3BucketUseCase.execute(localZipFolder)
    expect(uploadZipToCompactedBucketSpy).toHaveBeenCalledTimes(1)
    expect(uploadZipToCompactedBucketSpy).toHaveBeenCalledWith(localZipFolder)
  })
})
