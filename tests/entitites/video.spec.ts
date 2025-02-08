import { describe, it, expect } from 'vitest'
import { Video } from '../../src/Entities/video'

describe('Video Entity', () => {
  const videoData = {
    id: 'video-id',
    name: 'video-name',
    size: 100,
    contentType: 'video/mp4',
    hash: 'folder-to-zip',
    managerService: { url: 'manager-service-url' },
    processService: { images: [{ url: 'image-url' }] },
  }

  it('should correctly initialize with provided data', () => {
    const video = new Video(videoData)

    expect(video.id).toBe(videoData.id)
    expect(video.name).toBe(videoData.name)
    expect(video.hash).toBe(videoData.hash)
    expect(video.processService).toEqual(videoData.processService)
  })

  it('should return a valid JSON representation', () => {
    const video = new Video(videoData)
    expect(video.toJSON()).toEqual(videoData)
  })
})
