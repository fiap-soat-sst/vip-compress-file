import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CompressToZip } from '../../src/External/compress/compressToZip' // Update path if needed
import * as fs from 'fs'

// Mock fs
vi.mock('fs', () => ({
  readdirSync: vi.fn(),
}))

// Mock AdmZip
const addLocalFileMock = vi.fn()
const writeZipMock = vi.fn()

vi.mock('adm-zip', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      addLocalFile: addLocalFileMock,
      writeZip: writeZipMock,
    })),
  }
})

describe('CompressToZip', () => {
  let compressToZip: CompressToZip

  beforeEach(() => {
    compressToZip = new CompressToZip()
    vi.clearAllMocks() // Reset mocks before each test
  })

  it('should compress images into a zip file', () => {
    const mockFiles = ['image1.jpg', 'image2.png']
    const mockPath = '/mock/path'
    const expectedZipPath = '/mock/path.zip'

    ;(fs.readdirSync as any).mockReturnValue(mockFiles)

    const result = compressToZip.compressImagesToZip(mockPath)

    // Verify that addLocalFile was called for each file
    expect(addLocalFileMock).toHaveBeenCalledTimes(mockFiles.length)
    mockFiles.forEach((file) => {
      expect(addLocalFileMock).toHaveBeenCalledWith(`${mockPath}/${file}`)
    })

    // Verify that writeZip was called with the correct output path
    expect(writeZipMock).toHaveBeenCalledWith(expectedZipPath)
    expect(result).toBe(expectedZipPath)
  })
})
