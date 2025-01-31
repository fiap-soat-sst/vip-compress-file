// test/useCases/compressImagesToZipUseCase.spec.ts
import { CompressImagesToZipUseCase } from '../../src/UseCases/compressImagesToZipUseCase'
import { CompressToZip } from '../../src/External/compress/compressToZip'
import { ICompressGateway } from '../../src/Gateways/ICompressGateway'
import { vi } from 'vitest'

describe('compressImagesToZipUseCase', () => {
  let compressImagesToZipUseCase: CompressImagesToZipUseCase
  let compressGateway: ICompressGateway

  beforeEach(() => {
    compressGateway = new CompressToZip()
    compressImagesToZipUseCase = new CompressImagesToZipUseCase(compressGateway)
  })

  it('should compress images to zip', async () => {
    const rawImages = 'tozip/mnetc'
    vi.spyOn(compressGateway, 'compressImagesToZip')

    await compressImagesToZipUseCase.execute(rawImages)

    expect(compressGateway.compressImagesToZip).toHaveBeenCalledTimes(1)
    expect(compressGateway.compressImagesToZip).toHaveBeenCalledWith(rawImages)
  })

  it('should throw an error if compression fails', async () => {
    const rawImages = 'path/to/non-existent/images'
    vi.spyOn(compressGateway, 'compressImagesToZip').mockImplementation(() => {
      throw new Error('Compression failed')
    })
    await expect(
      compressImagesToZipUseCase.execute(rawImages)
    ).rejects.toThrowError('Compression failed')
  })
})
